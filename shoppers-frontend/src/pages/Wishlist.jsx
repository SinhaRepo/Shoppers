import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { getProductImage } from '../api/productApi';
import { getCategoryImage } from '../utils/categoryPlaceholder';
import { formatPrice } from '../utils/formatPrice';
import PriceTag from '../components/ui/PriceTag';
import { useState } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Heart size={64} className="mx-auto text-warm-greige mb-4" />
          <h1 className="text-xl font-bold text-text-primary">Your wishlist is empty</h1>
          <p className="text-sm text-text-muted mt-2">
            Save items you love by tapping the heart icon on any product.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text-primary">
            My Wishlist ({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})
          </h1>
          <button
            onClick={clearWishlist}
            className="text-sm text-text-muted hover:text-red-accent transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={() => removeFromWishlist(product.id)}
              onAddToBag={() => {
                addToCart(product);
                removeFromWishlist(product.id);
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const WishlistCard = ({ product, onRemove, onAddToBag }) => {
  const [imgError, setImgError] = useState(false);

  const originalPrice = product.mrp || product.price;
  const discount =
    originalPrice > product.price
      ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
      : 0;
  const isOutOfStock = !product.productAvailable || product.stockQuantity === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-bg-card rounded-xl border border-border-card shadow-card overflow-hidden group"
    >
      <Link to={`/product/${product.id}`}>
        <div
          className={`relative aspect-square bg-bg-card-image overflow-hidden ${
            isOutOfStock ? 'grayscale-[0.6]' : ''
          }`}
        >
          <img
            src={
              imgError
                ? getCategoryImage(product.category)
                : product.imageUrl1 || getProductImage(product.id)
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          {discount > 0 && !isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-accent text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              {discount}% off
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 space-y-2">
        <Link to={`/product/${product.id}`}>
          <p className="text-[13px] text-text-primary line-clamp-2 leading-snug min-h-[36px] hover:text-red-accent transition-colors">
            {product.name}
          </p>
        </Link>

        <PriceTag
          price={product.price}
          originalPrice={originalPrice}
          discount={isOutOfStock ? null : discount}
          size="md"
        />

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onAddToBag}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold bg-btn-primary-bg text-btn-primary-text hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={14} />
            {isOutOfStock ? 'Out of Stock' : 'Move to Bag'}
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg border border-border-card text-text-muted hover:text-red-accent hover:border-red-accent transition-colors"
            title="Remove from wishlist"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
