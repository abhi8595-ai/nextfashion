import { getStoredOrders } from '../utils/orderHistory';

export default defineEventHandler(() => {
  return {
    orders: getStoredOrders(),
  };
});
