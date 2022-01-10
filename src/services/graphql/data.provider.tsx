import { CrudFilter, CrudFilters, CrudOperators, CrudSorting, DataProvider } from "@pankod/refine";
import { GraphQLClient } from "graphql-request";
import * as gql from "gql-query-builder";
import pluralize from "pluralize";
import camelCase from "camelcase";
import { GetListArgs, GetManyArgs } from "./types";

type RecordRow = Record<string, any>

function iterToObject<T>(
  items: T[] | undefined,
  keyProp: string | ((v: any) => string),
  keyValue?: string,
) {
  const objects: { [key: string]: T } = {}

  if (items && items.length) {
    items.map((val: RecordRow) => {
      objects[
        typeof keyProp === 'string' ?
          val[keyProp] :
          keyProp(val)
      ] =
        keyValue ?
          val[keyValue] :
          val
    })
  }

  if (!Object.keys(objects).length) return undefined

  return objects
}

function generateFilter(iters: { [key: string]: CrudFilter; }) {
  const objects: { [key: string]: any } = {}
  const filterBy = iters && Object.values(iters);

  const parseOperator = (operate: ForceOperator) => {
    let operator = ""

    switch (operate) {
      case 'nin':
        operator = "notIn"
        break;
      case 'eq':
        operator = "equals"
        break;
      default:
        return operate
    }

    return operator
  }

  if (!filterBy) return undefined

  filterBy.map(val => {
    objects[val?.field] = {
      [parseOperator(val.operator)]: val.value
    }
  })

  return objects
}

export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, _index) {
      return word.toUpperCase()
    })
    .replace(/\s+/g, ' ')
}

// Integrate with where types in redwood
type RedwoodOperator =
  | 'in'
  | 'notIn'
  | 'equals';

type ForceOperator = RedwoodOperator | CrudOperators | any;

const dataProvider = (client: GraphQLClient) => {
  return {
    getList: async ({
      resource,
      pagination,
      sort,
      filters,
      metaData,
      requestHeaders
    }: GetListArgs) => {
      console.log('getList called')

      const current = pagination?.current || 1; // as page = 1
      const pageSize = pagination?.pageSize || 10; // as ITEMS_PER_PAGE as limit

      const sortBy = iterToObject(sort, 'field', 'order');
      let $where = generateFilter(iterToObject(filters, 'field')!!);

      console.log('sortBy', sortBy)

      // Guard for clear filter, or if filter has lack values
      // Set data to default, $where => not executed
      if ($where) {
        for (const [key, value] of Object.entries($where)) {
          const objField = Object.values(value)

          if (
            objField.includes(0)
            || objField.includes(NaN)
            || objField.includes("")
            || objField.includes(undefined)
          ) {
            // Delete [prop] lack values in current object
            delete $where[key]
          }
        }
      }

      console.log('$where', $where)

      const camelResource = camelCase(resource);
      const operation = metaData?.operation ?? camelResource;

      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      console.log('variables', metaData?.variables)

      const { query, variables } = gql.query({
        operation,
        variables: {
          input: {
            value: {
              ...metaData?.variables,
              ...sortBy && {
                sort: JSON.stringify(sortBy)
              },
              ...$where && {
                filter: JSON.stringify($where),
              },
              start: (current - 1) * pageSize || 1,
              limit: pageSize,
            },
            type: `${camelName}`,
          }
        },
        fields: [...metaData?.fields!!],
      })
      console.log('query getList', query, variables)

      const response = await client.request(
        query,
        variables,
        requestHeaders ?? undefined
      );
      console.log('response', response)

      return {
        data: response[operation],
        total: response[operation].length,
      };

    },
    getMany: async ({ resource, metaData, requestHeaders }: GetManyArgs) => {
      console.log('getMany called')

      const camelResource = camelCase(resource);
      const operation = metaData?.operation ?? camelResource;

      const { query, variables } = gql.query({
        operation,
        variables: {
          ...metaData?.variables
        },
        fields: metaData?.fields
      });

      console.log('query getMany', query)

      const response = await client.request(
        query,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      }
    },
    getOne: async ({ resource, id, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelResource = camelCase(singularResource);

      const operation = metaData?.operation ?? camelResource;
      const { query, variables } = gql.query({
        operation,
        variables: {
          id: {
            value: +id!!,
            type: "Int",
            required: true
          },
        },
        fields: metaData?.fields,
      });

      console.log('query getOne', query)

      const response = await client.request(
        query,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    create: async ({ resource, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      const operation = resource;
      const { query: mutation, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          input: {
            value: { ...variables },
            type: `${camelName}`,
            required: true,
          },
        },
        fields: metaData?.fields,
      });

      console.log('query create', mutation)

      const response = await client.request(
        mutation,
        gqlVariables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    createMany: async ({ resource, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      const operation = resource;

      const onGql = (vars: Record<string, any>) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            input: {
              value: { ...vars },
              type: `${camelName}`,
              required: true,
            },
          },
          fields: metaData?.fields,
        });

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        variables.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      console.log('response createMany', response);

      return {
        data: response
      }
    },
    update: async ({ resource, id, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;
      const operation = resource;

      const { query: mutation, variables: gqlVariables } = gql.mutation({
        operation,
        variables: {
          id: {
            value: +id!!,
            type: "Int",
            required: true
          },
          input: {
            value: { ...variables },
            type: `${camelName}`,
            required: true,
          },
        },
        fields: metaData?.fields,
      });

      const response = await client.request(
        mutation,
        gqlVariables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    updateMany: async ({ resource, ids, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      const operation = resource;

      const onGql = (value: string) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            id: {
              value: +value!!,
              type: "Int",
              required: true
            },
            input: {
              value: { ...variables },
              type: `${camelName}`,
              required: true,
            },
          },
          fields: metaData?.fields,
        });

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        ids!!.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      return {
        data: response
      }
    },
    deleteOne: async ({ resource, id, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;
      const operation = resource;

      const { query: mutation, variables } = gql.mutation({
        operation,
        variables: {
          id: {
            value: +id!!,
            type: "Int",
            required: true
          },
        },
        fields: metaData?.fields,
      });

      console.log('mutation deleteOne', mutation);

      const response = await client.request(
        mutation,
        variables ?? undefined,
        requestHeaders ?? undefined
      )

      return {
        data: response[operation],
      };
    },
    deleteMany: async ({ resource, ids, variables, metaData, requestHeaders }: GetManyArgs) => {
      const singularResource = pluralize.singular(resource);
      const camelName = `${toCamelCase(resource)}Input`;

      const operation = resource;

      const onGql = (value: string) => {
        const { query: mutation, variables: gqlVariables } = gql.mutation({
          operation,
          variables: {
            id: {
              value: +value!!,
              type: "Int",
              required: true
            },
          },
          fields: metaData?.fields,
        });

        return {
          mutation,
          gqlVariables
        }
      }

      const response = await Promise.all(
        ids!!.map(async (param) => {
          const { mutation, gqlVariables } = onGql(param);
          const response = await client.request(
            mutation,
            gqlVariables ?? undefined,
            requestHeaders ?? undefined
          )

          return response
        })
      )

      return {
        data: response
      }
    },
  }
}

export default dataProvider;