const defaultUserDetails = (): CheckoutUserDetails => ({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  address1: '',
  postcode: '',
});

const demoOrder = (): CheckoutOrder => ({
  id: 'demo-order-1',
  total: '$129.00',
  subtotal: '$119.00',
  shippingTotal: '$10.00',
  orderNumber: '1001',
  date: new Date().toISOString(),
  paymentMethodTitle: 'Cash on delivery',
  status: 'completed',
  billing: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex@example.com',
    phone: '+1 555 010 2040',
    address1: '42 Market Street',
    city: 'New York',
    postcode: '10001',
  },
  lineItems: {
    nodes: [
      { product: { node: { name: 'Classic Leather Jacket' } }, quantity: 1, total: '$89.00' },
      { product: { node: { name: 'Canvas Tote Bag' } }, quantity: 2, total: '$40.00' },
    ],
  },
});

const sanitizeUserDetails = (value: Partial<CheckoutUserDetails> = {}): CheckoutUserDetails => ({
  email: value.email ?? '',
  firstName: value.firstName ?? '',
  lastName: value.lastName ?? '',
  phone: value.phone ?? '',
  city: value.city ?? '',
  address1: value.address1 ?? '',
  postcode: value.postcode ?? '',
});

export const useCheckout = () => {
  const { cart } = useCart();
  const order = useState<CheckoutOrder | null>('order', () => null);
  const userDetails = useState<CheckoutUserDetails>('userDetails', defaultUserDetails);
  const orders = useState<CheckoutOrder[]>('orders', () => []);
  const checkoutStatus = ref<CheckoutStatus>('order');
  const showPaymentSuccess = useState<boolean>('showPaymentSuccess', () => false);

  const persistProfile = () => {
    if (!process.client) return;
    localStorage.setItem('userDetails', JSON.stringify(sanitizeUserDetails(userDetails.value)));
  };

  const persistOrders = () => {
    if (!process.client) return;
    localStorage.setItem('orders', JSON.stringify(orders.value));
  };

  

  const clearCart = () => {
    cart.value = [];
    if (!process.client) return;
    localStorage.setItem('cart', JSON.stringify(cart.value));
  };

  const updateProfile = (updates: Partial<CheckoutUserDetails>) => {
    const nextProfile = sanitizeUserDetails({ ...userDetails.value, ...updates });
    userDetails.value = nextProfile;
    if (process.client) {
      localStorage.setItem('userDetails', JSON.stringify(nextProfile));
    }
  };

  const saveProfile = () => {
    const nextProfile = sanitizeUserDetails(userDetails.value);
    userDetails.value = nextProfile;
    if (process.client) {
      localStorage.setItem('userDetails', JSON.stringify(nextProfile));
      localStorage.setItem('profileSavedAt', new Date().toISOString());
    }
    return nextProfile;
  };

  const handleCheckout = async () => {
    if (checkoutStatus.value !== 'order') return;
    checkoutStatus.value = 'processing';

    try {
      const response = await $fetch<CheckoutResponse>('/api/checkout', {
        method: 'POST',
        body: {
          billing: sanitizeUserDetails(userDetails.value),
          paymentMethod: 'cod',
        },
      });

      clearCart();
      const placedOrder = response.checkout?.order ?? null;
      order.value = placedOrder;

      if (placedOrder) {
        showPaymentSuccess.value = true;
        const savedOrder = {
          ...placedOrder,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        };

        try {
          await $fetch('/api/orders', {
            method: 'POST',
            body: savedOrder,
          });
        } catch (backendError) {
          console.error('Failed to persist order history on server', backendError);
        }

        orders.value = [savedOrder, ...orders.value].slice(0, 10);
        persistOrders();
      }
    } finally {
      checkoutStatus.value = 'order';
    }
  };

  onMounted(async () => {
    if (!process.client) return;

    try {
      const savedProfile = localStorage.getItem('userDetails');
      if (savedProfile) {
        userDetails.value = sanitizeUserDetails(JSON.parse(savedProfile));
      }

      try {
        const serverOrders = await $fetch<{ orders: CheckoutOrder[] }>('/api/orders');
        if (Array.isArray(serverOrders?.orders) && serverOrders.orders.length) {
          orders.value = serverOrders.orders;
          localStorage.setItem('orders', JSON.stringify(orders.value));
        } else {
          orders.value = [demoOrder()];
          localStorage.setItem('orders', JSON.stringify(orders.value));
        }
      } catch (backendError) {
        console.error('Failed to load order history from server', backendError);

        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          orders.value = JSON.parse(savedOrders);
        } else {
          orders.value = [demoOrder()];
          localStorage.setItem('orders', JSON.stringify(orders.value));
        }
      }
    } catch {
      userDetails.value = defaultUserDetails();
      orders.value = [demoOrder()];
    }
    // no polling — keep initial load behavior only
  });

  return {
    order,
    orders,
    userDetails,
    checkoutStatus,
    showPaymentSuccess,
    handleCheckout,
    
    updateProfile,
    saveProfile,
  };
};
