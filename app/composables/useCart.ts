import { push } from 'notivue';

const CART_STORAGE_KEY = 'cart';

export const useCart = () => {
  const cart = useState<CartItem[]>('cart', () => []);
  const addToCartButtonStatus = ref<AddBtnStatus>('add');

  const persistCart = () => {
    if (!process.client) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.value));
  };

  const setCart = (items: CartItem[]) => {
    cart.value = items;
    persistCart();
  };

  const findItem = (variationId: number) => {
    return cart.value.find(item => item.variation?.node?.databaseId === variationId);
  };

  const handleAddToCart = async (productId: number, variationId: number) => {
    if (!productId || productId <= 0 || !variationId || variationId <= 0) {
      push.error('Invalid product selected');
      return;
    }

    const existingItem = findItem(variationId);
    if (existingItem) {
      const maxStock = existingItem.variation?.node?.stockQuantity;
      const nextQuantity = existingItem.quantity + 1;
      if (typeof maxStock === 'number' && nextQuantity > maxStock) {
        push.error('Insufficient stock');
        return;
      }
      changeQuantity(existingItem.key, nextQuantity);
      addToCartButtonStatus.value = 'added';
      setTimeout(() => {
        addToCartButtonStatus.value = 'add';
      }, 2000);
      return;
    }

    addToCartButtonStatus.value = 'loading';

    try {
      const response = await $fetch<AddToCartResponse>('/api/cart/add', {
        method: 'POST',
        body: { productId, variationId, quantity: 1 },
      });
      const incoming = response.addToCart.cartItem;
      const itemIndex = cart.value.findIndex(item => item.key === incoming.key);

      if (itemIndex >= 0) {
        const next = [...cart.value];
        next[itemIndex] = incoming;
        setCart(next);
      } else {
        setCart([...cart.value, incoming]);
      }

      addToCartButtonStatus.value = 'added';
      setTimeout(() => {
        addToCartButtonStatus.value = 'add';
      }, 2000);
    } catch (error: any) {
      addToCartButtonStatus.value = 'add';
      const message =
        typeof error === 'string'
          ? error
          : error?.message ||
            error?.response?.errors?.[0]?.message ||
            'Insufficient stock';
      push.error(message.replace(/<[^>]+>/g, '') || 'Insufficient stock');
    }
  };

  const changeQuantity = (key: string, quantity: number) => {
    const next =
      quantity <= 0
        ? cart.value.filter(item => item.key !== key)
        : cart.value.map(item => (item.key === key ? { ...item, quantity } : item));

    setCart(next);
    void $fetch('/api/cart/update', {
      method: 'POST',
      body: { items: [{ key, quantity }] },
    });
  };

  const increment = (variationId: number) => {
    const item = findItem(variationId);

    if (!item) {
      push.error('Cart item not found');
      return;
    }

    const maxStock = item.variation?.node?.stockQuantity;
    if (typeof maxStock === 'number' && item.quantity >= maxStock) {
      push.error('Insufficient stock');
      return;
    }

    changeQuantity(item.key, item.quantity + 1);
  };

  const decrement = (variationId: number) => {
    const item = findItem(variationId);
    if (!item) return;
    changeQuantity(item.key, item.quantity - 1);
  };

  onMounted(() => {
    if (!process.client) return;
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      setCart(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCart([]);
    }
  });
  

  return {
    cart,
    addToCartButtonStatus,
    handleAddToCart,
    increment,
    decrement,
  };
};
