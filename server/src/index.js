const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { resolvers, typeDefs } = require('./graphql');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(`${process.env.DB_URI}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) => {
    console.error(err);
  });

server.listen({ port: process.env.PORT }).then((res) => {
  console.log(`server is running at ${res.url}`);
});
