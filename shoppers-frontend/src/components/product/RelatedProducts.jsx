import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductImage } from '../../api/productApi';
import { getCategoryImage } from '../../utils/categoryPlaceholder';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';

const RelatedProducts = ({ products, currentId }) => {
  const { addToCart } = useCart();

  // Pick 3 related products (exclude current)
  const related = products
    .filter((p) => p.id !== currentId && p.productAvailable)
    .slice(0, 3);

  if (related.length === 0) return null;

  const totalPrice = related.reduce((sum, p) => sum + p.price, 0);
  const totalOriginal = related.reduce(
    (sum, p) => sum + (p.mrp || p.price),
    0
  );
  const savings = totalOriginal - totalPrice;

  const handleAddAll = () => {
    related.forEach((p) => addToCart(p));
  };

  return (
    <div className="bg-white rounded-xl border border-border-card p-4">
      <h3 className="text-sm font-bold text-text-primary mb-4">You May Also Like</h3>

      {/* Product stack with + icons */}
      <div className="space-y-3">
        {related.map((product, idx) => (
          <div key={product.id}>
            <Link
              to={`/product/${product.id}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-lg bg-bg-card-image overflow-hidden flex-shrink-0">
                <img
                  src={product.imageUrl1 || getProductImage(product.id)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getCategoryImage(product.category);
                  }}
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary line-clamp-2 group-hover:text-red-accent transition-colors">
                  {product.name}
                </p>
                <p className="text-xs font-bold text-text-price mt-0.5">
                  &#8377;{formatPrice(product.price)}
                </p>
              </div>
            </Link>

            {/* Plus separator */}
            {idx < related.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="w-5 h-5 rounded-full border border-border-card flex items-center justify-center">
                  <Plus size={12} className="text-text-muted" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total + savings */}
      <div className="mt-4 pt-3 border-t border-border-divider">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-price">
            &#8377;{formatPrice(totalPrice)}
          </span>
          {savings > 0 && (
            <span className="text-xs font-medium text-detail-savings-text">
              Save &#8377;{formatPrice(savings)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Bag CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAddAll}
        className="w-full mt-3 py-2.5 text-sm font-semibold bg-btn-primary-bg text-btn-primary-text rounded-lg hover:bg-black transition-colors"
      >
        Add All to Bag
      </motion.button>
    </div>
  );
};

export default RelatedProducts;
