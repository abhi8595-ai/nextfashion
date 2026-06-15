// app/gql/mutations/checkout.ts
import { gql } from 'graphql-request';

export const checkoutMutation = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        total
        subtotal
        shippingTotal
        orderNumber
        date
        paymentMethodTitle
        status
        billing {
          firstName
          lastName
          email
          phone
          address1
          city
          postcode
        }
        lineItems {
          nodes {
            product {
              node {
                name
              }
            }
            quantity
            total
          }
        }
      }
    }
  }
`;
