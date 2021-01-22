import { gql } from '@apollo/client';

export const GET_POST = gql`
  query {
    getPosts {
      _id
      body
      username
      createdAt
    }
  }
`;
