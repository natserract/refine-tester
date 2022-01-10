import { gql } from 'graphql-request'

export const CREATEDONATIONS_MUTATION = gql`
  mutation CreateDonations($input: CreateDonationInput!) {
    createDonationTemporary(input: $input) {
      id
      user_id
    }
  }
`
