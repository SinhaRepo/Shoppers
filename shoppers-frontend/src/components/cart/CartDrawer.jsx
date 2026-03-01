import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import { getProductImage } from '../../api/productApi';
import { getCategoryImage } from '../../utils/categoryPlaceholder';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsCartOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-drawer z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-divider">
              <h2 className="font-semibold text-text-primary text-lg">
                My Bag ({cartCount})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-warm-greige mb-4" />
                  <p className="text-text-primary font-medium mb-1">
                    Your bag is empty
                  </p>
                  <p className="text-text-muted text-sm mb-4">
                    Add items to get started
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/');
                    }}
                    className="px-6 py-2 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-medium hover:bg-[#222222] transition-colors"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 pb-4 border-b border-border-divider last:border-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-bg-card-image rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageUrl1 || getProductImage(product.id)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCategoryImage(product.category);
                        }}
                      />
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary font-medium line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-text-price mt-1">
                        &#8377;{formatPrice(product.price)}
                      </p>
                      {/* Quantity + remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            disabled={quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded border border-border-card text-text-secondary hover:bg-warm-beige disabled:opacity-40 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium text-text-primary w-5 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded border border-border-card text-text-secondary hover:bg-warm-beige transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-text-muted hover:text-red-accent transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border-divider px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Subtotal</span>
                  <span className="text-text-primary font-bold text-lg">
                    &#8377;{formatPrice(cartTotal)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg bg-btn-primary-bg text-btn-primary-text font-medium text-sm hover:bg-[#222222] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
