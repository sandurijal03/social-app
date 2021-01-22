const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type Post {
    _id: ID!
    body: String
    username: String
    comments: Comment
  }

  type Comment {
    id: ID!
    body: String
    username: String
  }

  input RegisterInput {
    email: String
    username: String
    password: String
    confirmPassword: String
  }

  type User {
    _id: ID!
    email: String
    token: String!
    username: String
  }

  type Query {
    getPosts: [Post]
  }

  type Mutation {
    createPost(body: String, username: String): Post
    register(registerInput: RegisterInput!): User
    login(username: String, password: String): User
  }
`;
