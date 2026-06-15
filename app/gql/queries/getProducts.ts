// app/gql/queries/getProducts.ts
import { gql } from 'graphql-request';

export const getProductsQuery = gql`
  query getProducts($after: String, $search: String, $category: String, $order: OrderEnum!, $field: ProductsOrderByEnum!) {
    products(first: 21, after: $after, where: { stockStatus: IN_STOCK, search: $search, category: $category, orderby: { field: $field, order: $order } }) {
      nodes {
        ... on VariableProduct {
          sku
          slug
          name
          regularPrice
          salePrice
          allPaStyle {
            nodes {
              name
            }
          }
          image {
            sourceUrl
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
