import { GRAPHQL_ENDPOINT } from 'constants/endpoint'
import { GraphQLClient } from 'graphql-request'

const authHeaders = {
  authorization: 'Bearer ' + 'MY_TOKEN',
}

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    ...authHeaders,
  },
})

export default client
