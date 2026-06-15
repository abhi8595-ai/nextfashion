import type { CheckoutOrder } from '../../shared/types';

const globalStore = globalThis as typeof globalThis & {
  __lane9OrderHistory?: CheckoutOrder[];
};

export const getStoredOrders = (): CheckoutOrder[] => {
  if (!globalStore.__lane9OrderHistory) {
    globalStore.__lane9OrderHistory = [];
  }

  return [...globalStore.__lane9OrderHistory].sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });
};

export const addStoredOrder = (order: CheckoutOrder) => {
  const nextOrder = {
    ...order,
    id: order.id ?? `server-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  const current = getStoredOrders();
  const updated = [nextOrder, ...current].slice(0, 25);
  globalStore.__lane9OrderHistory = updated;

  return updated;
};
