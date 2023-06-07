const { ApolloServer } = require('apollo-server');

const fs = require('fs');
const path = require('path');

/* const typeDefs = `
    type Link {
        id: ID!,
        description: String!,
        url: String!
    }
    type Query {
        info: String,
        feed: [Link!]!
    }
    type Mutation {
        post(description: String!, url: String!): Link! 
    }
`; */

let links = [
    {
        id: '0',
        description: 'test url',
        url: 'www.gql.com'
    },
    
];

const resolvers = {
    Query: {
        info: () => 'info text',
        feed: () => links
    },
    Link: {
        id: (root) => root.id,
        description: (root) => root.description,
        url: (root) => root.url,
    },
    Mutation: {
        create: (root, args) => {
            let idCount = links.length;

            const link = {
                id: `${idCount++}`,
                description: args.description,
                url: args.url
            }

            links.push(link);
            return link;
        },
        read: (root, args) => {
            const link = links.find(lk => lk.id === args.id);
            return link;
        },
        update: (root, args) => {
            const link = links.find(lk => lk.id === args.id);

            if (args.description) {
                link.description = args.description;
            }

            if (args.url) {
                link.url = args.url;
            }   

            return link;
        },
        delete: (root, args) => {
            const delLink = { ... links.find(lk => lk.id === args.id) };
            links = links.filter(lk => lk.id !== args.id);
            return delLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname,'./schema.gql'),
        { encoding: 'utf-8' }
    ),
    resolvers
});


server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`)
});


/*

{
info,
  feed {
    id,
    description,
    url
  }
}

mutation {
  create(description: "New desc", url: "www.goggle.com") {
    id
  }
}

mutation {
    read(id: "2") {
        id,
        description,
        url
  }
}

mutation {
    update(id: "2", description: "Video app", url: "www.youtube.com") {
        id,
        description,
        url
    }
}

mutation {
    delete(id: "1") {
        id
  }
}
 */