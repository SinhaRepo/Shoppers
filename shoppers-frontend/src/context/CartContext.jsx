import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

const CART_KEY = 'shoppers_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const max = product.stockQuantity || 99;
        if (existing.quantity >= max) {
          toast.error(`Max ${max} items available`);
          return prev;
        }
        toast.success('Quantity updated in bag');
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success('Added to bag');
      return [...prev, { product, quantity: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    toast.success('Removed from bag');
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item;
        const max = item.product.stockQuantity || 99;
        if (qty > max) {
          toast.error(`Max ${max} items available`);
          return { ...item, quantity: max };
        }
        return { ...item, quantity: qty };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      cartBounce,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isCartOpen, cartBounce]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
