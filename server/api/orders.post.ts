import { addStoredOrder } from '../utils/orderHistory';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order payload' });
  }

  const order = addStoredOrder(body as any);

  return {
    ok: true,
    orders: order,
  };
});
