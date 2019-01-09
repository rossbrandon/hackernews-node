const {
    GraphQLServer
} = require('graphql-yoga')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (parent, args) => links.find(item => item.id == args.id)
    },

    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        },

        updateLink: (parent, args) => {
            const link = links.find(item => item.id == args.id)
            link.description = args.description ? args.description : link.description
            link.url = args.url ? args.url : link.url
            return link
        },

        deleteLink: (parent, args) => {
            const link = links.find(item => item.id == args.id)
            if (link) {
                links.pop(link)
                return link
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))