import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import toast from 'react-hot-toast';
import { getAllProducts } from '../api/productApi';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

const WISHLIST_KEY = 'shoppers_wishlist';

const loadLocalIds = () => {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [wishlistIds, setWishlistIds] = useState(loadLocalIds);
  const [wishlist, setWishlist] = useState([]);

  /* Sync: load from backend when user logs in, fall back to localStorage when not */
  useEffect(() => {
    if (isAuthenticated) {
      axiosInstance
        .get('/wishlist')
        .then((res) => {
          const products = res.data;
          setWishlist(products);
          setWishlistIds(products.map((p) => p.id));
        })
        .catch(() => {
          // Fall back to localStorage
          hydrateFromLocal();
        });
    } else {
      hydrateFromLocal();
    }
  }, [isAuthenticated]);

  const hydrateFromLocal = () => {
    const ids = loadLocalIds();
    setWishlistIds(ids);
    if (ids.length === 0) {
      setWishlist([]);
      return;
    }
    getAllProducts()
      .then((res) => {
        const idSet = new Set(ids);
        setWishlist(res.data.filter((p) => idSet.has(p.id)));
      })
      .catch(() => {});
  };

  /* Persist IDs to localStorage always (offline fallback) */
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = useCallback(
    (product) => {
      if (wishlistIds.includes(product.id)) return;

      setWishlistIds((prev) => [...prev, product.id]);
      setWishlist((prev) => [...prev, product]);
      toast.success('Added to wishlist');

      if (isAuthenticated) {
        axiosInstance.post(`/wishlist/${product.id}`).catch(() => {});
      }
    },
    [wishlistIds, isAuthenticated]
  );

  const removeFromWishlist = useCallback(
    (id) => {
      setWishlistIds((prev) => prev.filter((pid) => pid !== id));
      setWishlist((prev) => prev.filter((p) => p.id !== id));
      toast.success('Removed from wishlist');

      if (isAuthenticated) {
        axiosInstance.delete(`/wishlist/${id}`).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (wishlistIds.includes(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [wishlistIds, addToWishlist, removeFromWishlist]
  );

  const isWishlisted = useCallback(
    (id) => wishlistIds.includes(id),
    [wishlistIds]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    setWishlist([]);
    if (isAuthenticated) {
      axiosInstance.delete('/wishlist').catch(() => {});
    }
  }, [isAuthenticated]);

  const wishlistCount = wishlistIds.length;

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      wishlistCount,
    }),
    [wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, clearWishlist, wishlistCount]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
