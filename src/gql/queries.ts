import { gql } from "graphql-request";

const findByOwner = gql`
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
