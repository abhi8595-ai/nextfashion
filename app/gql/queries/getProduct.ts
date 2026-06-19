// app/gql/queries/getProduct.ts
import { gql } from 'graphql-request';

export const getProductQuery = gql`
  query getProduct($slug: ID!, $sku: String!) {
    product(id: $slug, idType: SLUG) {
      ... on VariableProduct {
        databaseId
        sku
        slug
        name
        regularPrice
        salePrice
        description
        image {
          sourceUrl
        }
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        allPaColor {
          nodes {
            name
          }
        }
        allPaStyle {
          nodes {
            name
          }
        }
        productTypes {
          nodes {
            products(where: { stockStatus: IN_STOCK, search: $sku }) {
              nodes {
                slug
                image {
                  sourceUrl
                }
                allPaColor {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        }
        variations(where: { orderby: { field: NAME, order: DESC } }) {
          nodes {
            databaseId
            stockStatus
            stockQuantity
            salePrice(format: RAW)
            regularPrice(format: RAW)
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
        related(first: 50) {
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
        }
      }
    }
  }
`;
