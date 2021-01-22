const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { resolvers, typeDefs } = require('../src/graphql/index');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(`${process.env.DB_URI}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) => {
    console.error(err);
  });

server.listen({ port: process.env.PORT }).then((res) => {
  console.log(`server is running at ${res.url}`);
});
