import { gql } from "graphql-request";

export const searchQuery = gql`
  query search($appName: String!) {
    transactions(first: 5, tags: [{ name: "App-Name", values: [$appName] }]) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

export const metadataByTxId = gql`
  query findByTxId($transaction: ID!) {
    transactions(first: 1, ids: [$transaction]) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;
