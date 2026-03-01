import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getProductImage } from '../api/productApi';
import { getCategoryImage } from '../utils/categoryPlaceholder';
import { formatPrice, getDiscount } from '../utils/formatPrice';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-warm-greige mb-4" />
          <h1 className="text-xl font-bold text-text-primary">Your bag is empty</h1>
          <p className="text-sm text-text-muted mt-2">
            Looks like you have not added anything to your bag yet.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </motion.div>
    );
  }

  const totalOriginal = cart.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity,
    0
  );
  const savings = totalOriginal - cartTotal;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-text-primary mb-6">
          My Bag ({cartCount} item{cartCount !== 1 ? 's' : ''})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-border-card p-4 flex gap-4"
              >
                <Link to={`/product/${product.id}`} className="w-24 h-24 flex-shrink-0 rounded-lg bg-bg-card-image overflow-hidden">
                  <img
                    src={product.imageUrl1 || getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getCategoryImage(product.category);
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm font-semibold text-text-primary line-clamp-2 hover:text-red-accent transition-colors"
                    >
                      {product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-text-muted hover:text-red-accent transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-xs text-text-muted mt-0.5">{product.brand} / {product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0.5 border border-border-card rounded-lg">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-1.5 hover:bg-warm-beige rounded-l-lg disabled:opacity-40 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-warm-beige rounded-r-lg transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-text-price">
                        &#8377;{formatPrice(product.price * quantity)}
                      </p>
                      {(() => {
                        const orig = product.mrp || product.price;
                        const disc = getDiscount(orig, product.price);
                        return disc > 0 ? (
                          <p className="text-xs text-detail-savings-text">{disc}% off</p>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border-card p-5 sticky top-24">
              <h2 className="text-sm font-bold text-text-primary mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal ({cartCount} items)</span>
                  <span className="text-text-primary">&#8377;{formatPrice(totalOriginal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Discount</span>
                  <span className="text-detail-savings-text">-&#8377;{formatPrice(savings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="text-detail-savings-text">Free</span>
                </div>
              </div>

              <div className="border-t border-border-divider my-4" />

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-primary">Total</span>
                <span className="text-lg font-bold text-text-price">&#8377;{formatPrice(cartTotal)}</span>
              </div>

              {savings > 0 && (
                <p className="text-xs text-detail-savings-text mt-1 text-right">
                  You save &#8377;{formatPrice(savings)}
                </p>
              )}

              <Link
                to="/checkout"
                className="block w-full mt-5 py-3 text-center bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
