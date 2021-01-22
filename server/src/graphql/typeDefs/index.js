const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    _id: ID!
    body: String
    username: String
    createdAt: String
    comments: [Comment]
    likes: [Like]
    likeCount: Int
    commentCount: Int
  }

  type Comment {
    id: ID!
    body: String
    username: String
    createdAt: String
  }

  type Like {
    id: ID!
    createdAt: String
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
    createdAt: String
    username: String
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    createPost(body: String): Post
    register(registerInput: RegisterInput): User
    login(username: String, password: String): User
    deletePost(postId: ID!): String
    createComment(postId: ID!, body: String): Post!
    deleteComment(postId: ID!, commendId: ID!): Post!
    likePost(postId: ID!): Post
  }

  type Subscription {
    newPost: Post!
  }
`;
