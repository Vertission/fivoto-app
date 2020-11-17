import { gql } from '@apollo/client';

export const AD = gql`
  query ad($id: ID!) {
    ad(id: $id) {
      id
      type
      category {
        field
        item
      }
      location {
        district
        city
      }
      title
      price
      description
      photos
      phone
      fields
      createdAt
      updatedAt
      user {
        id
        name
      }
    }
  }
`;
