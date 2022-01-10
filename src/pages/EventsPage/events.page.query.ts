import { gql } from 'graphql-request'

export const EVENTS_QUERY = gql`
  query EventsQuery {
    eventPage {
      events {
        id
        title
        description
        content
        created_at
        updated_at
      }
    }
  }
`
