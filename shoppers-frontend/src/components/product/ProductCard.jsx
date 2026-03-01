import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import StarRating from '../ui/StarRating';
import PriceTag from '../ui/PriceTag';
import Badge from '../ui/Badge';
import { getProductImage } from '../../api/productApi';
import { getCategoryImage } from '../../utils/categoryPlaceholder';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const wished = isWishlisted(product.id);

  const originalPrice = product.mrp || product.price;
  const discount = originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const isOutOfStock =
    !product.productAvailable || product.stockQuantity === 0;

  // Real rating from API (ProductResponse DTO)
  const rating = product.avgRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-bg-card rounded-xl border border-border-card shadow-card hover:shadow-card-hover overflow-hidden cursor-pointer group relative flex flex-col h-full"
      onClick={handleClick}
    >
      {/* Image area */}
      <div
        className={`relative aspect-square bg-bg-card-image overflow-hidden ${
          isOutOfStock ? 'grayscale-[0.6]' : ''
        }`}
      >
        <img
          src={imgError ? getCategoryImage(product.category) : (product.imageUrl1 || getProductImage(product.id))}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Badge top-left */}
        {isOutOfStock ? (
          <div className="absolute top-2 left-2">
            <Badge variant="gray">Out of Stock</Badge>
          </div>
        ) : (
          discount > 0 && (
            <div className="absolute top-2 left-2">
              <Badge>{discount}% off</Badge>
            </div>
          )
        )}

        {/* Heart top-right — show on hover */}
        <motion.button
          animate={{ scale: wished ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={16}
            fill={wished ? '#EE4D2D' : 'none'}
            className={wished ? 'text-red-heart' : 'text-text-muted'}
          />
        </motion.button>
      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[13px] text-text-primary line-clamp-2 leading-snug mb-1.5 min-h-[36px]">
          {product.name}
        </p>

        <PriceTag
          price={product.price}
          originalPrice={originalPrice}
          discount={isOutOfStock ? null : discount}
          size="md"
        />

        {/* Rating row */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={rating} size={10} showValue />
            {reviewCount > 0 && (
              <span className="text-text-muted text-[10px]">
                | {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
