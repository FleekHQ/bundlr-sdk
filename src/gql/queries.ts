import { gql } from "graphql-request";

export const findByOwner = gql`
  query findByOwner(owner: String!){
    transactions(owners:[owner]) {
        edges {
            node {
                id
            }
        }
    }
  }
`;
