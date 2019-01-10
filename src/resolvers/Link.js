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

module.exports = {
  postedBy,
  votes,
  voteCount
}
