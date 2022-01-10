import { Variables } from 'graphql-request'
import client from 'services/graphql'

export async function requestGql<T>(
  query: T | any,
  variables?: Variables,
  requestHeaders?: HeadersInit | undefined
) {
  const response = await client.request(
    query,
    variables ?? undefined,
    requestHeaders ?? undefined
  )

  return {
    data: response as T,
  }
}
