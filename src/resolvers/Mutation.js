const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('User not found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context)
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  })

  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  })
}

function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

async function unvote(parent, args, context, info) {
  const userId = getUserId(context)
  const vote = await context.prisma.votes({
    where: {
      AND: [{ link: { id: args.linkId } }, { user: { id: userId } }]
    }
  })
  const voteId = vote[0].id

  /*
  return context.prisma.updateLink({
    where: {
      id: args.linkId
    },
    data: {
      votes: {
        delete: {
          id: voteId
        }
      }
    }
  })
  */
  return context.prisma.deleteVote({ id: voteId })
}

module.exports = {
  signup,
  login,
  post,
  vote,
  unvote
}
