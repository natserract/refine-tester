import { gql } from "graphql-request";

export const USERDETAIL_AUTHSTORE_QUERY = gql`
  query UserDetailAuthStoreQuery($email: String!) {
    userDetail(email: $email) {
      id
      email
      email_verified
    }
  }
`
