const { getUserId } = require('../utils')

function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy()
}

function votes(parent, args, context) {
  return context.prisma.link({ id: parent.id }).votes()
}

async function voteCount(parent, args, context) {
  const votes = await context.prisma.link({ id: parent.id }).votes()
  return votes.length
}

async function voted(parent, args, context) {
  const userId = getUserId(context)
  const votes = await context.prisma.votes({
    where: {
      AND: [{ link: { id: parent.id } }, { user: { id: userId } }]
    }
  })
  return votes[0] ? true : false
}

module.exports = {
  postedBy,
  votes,
  voteCount,
  voted
}
