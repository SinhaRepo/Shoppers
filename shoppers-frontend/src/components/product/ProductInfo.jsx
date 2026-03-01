import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Check, Link2 } from 'lucide-react';
import PriceTag from '../ui/PriceTag';
import StarRating from '../ui/StarRating';
import { getDiscount } from '../../utils/formatPrice';
import { ATTRIBUTE_LABELS } from '../../utils/categoryAttributes';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import toast from 'react-hot-toast';

/* Keys to show as highlight specs in the info panel (non-color, non-size) */
const HIGHLIGHT_KEYS = [
  'modelName', 'warrantyPeriod', 'powerVoltage', 'fabric', 'strapMaterial',
  'outerMaterial', 'material', 'capacity', 'resolutionMegapixels',
  'compatibleOS', 'compatibleModels', 'type', 'displayType',
];

const ProductInfo = ({ product, addToRef }) => {
  const attrs = useMemo(() => {
    if (!product.attributes) return {};
    try { return JSON.parse(product.attributes); } catch { return {}; }
  }, [product.attributes]);

  const [selectedSize, setSelectedSize] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const addBtnRef = useRef(null);

  const wished = isWishlisted(product.id);

  useEffect(() => {
    if (addToRef && addBtnRef.current) {
      addToRef.current = addBtnRef.current;
    }
  }, [addToRef]);

  const originalPrice = product.mrp || product.price;
  const discount = getDiscount(originalPrice, product.price);
  const isAvailable = product.productAvailable && product.stockQuantity > 0;
  const rating = product.avgRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  /* Derive size options from schema for the category */
  const sizeField = useMemo(() => {
    const cat = product.category;
    if (cat === 'Clothing' || cat === 'Shoes') {
      const schema = { Clothing: ['XS','S','M','L','XL','XXL'], Shoes: ['5 UK','6 UK','7 UK','8 UK','9 UK','10 UK','11 UK','12 UK'] };
      return schema[cat] || null;
    }
    return null;
  }, [product.category]);

  /* Highlight specs to display (exclude color, size, common fields) */
  const highlights = useMemo(() => {
    const entries = [];
    HIGHLIGHT_KEYS.forEach((key) => {
      if (attrs[key]) {
        entries.push({ label: ATTRIBUTE_LABELS[key] || key, value: attrs[key] });
      }
    });
    return entries;
  }, [attrs]);

  const handleBuy = () => {
    if (!isAvailable) return;
    addToCart(product);
    navigate('/checkout');
  };

  const handleAddToBag = () => {
    if (!isAvailable) return;
    addToCart(product);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-2xl font-bold text-text-primary leading-tight line-clamp-2">
        {product.name}
      </h1>

      {/* Stats row */}
      {rating > 0 && (
        <div className="flex items-center gap-3 text-text-muted text-[13px] flex-wrap">
          <StarRating rating={rating} size={13} showValue count={reviewCount} />
        </div>
      )}

      {/* Price */}
      <PriceTag
        price={product.price}
        originalPrice={originalPrice}
        discount={discount}
        size="lg"
      />

      {/* Color (only if attribute exists) */}
      {attrs.color && (
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Color</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warm-beige rounded-lg text-sm text-text-primary">
            <Check size={14} className="text-green-600" />
            {attrs.color}
          </div>
        </div>
      )}

      {/* Size selector (only Clothing / Shoes) */}
      {sizeField && (
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            Select Size {attrs.size && <span className="text-text-muted font-normal text-xs ml-1">(Listed: {attrs.size})</span>}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {sizeField.map((size, idx) => (
              <button
                key={size}
                onClick={() => setSelectedSize(idx)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                  idx === selectedSize
                    ? 'bg-bg-size-active text-text-size-active border-bg-size-active'
                    : 'bg-bg-size-inactive text-text-size-inactive border-border-size hover:border-text-primary'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Specs highlights */}
      {highlights.length > 0 && (
        <div className="bg-warm-white rounded-lg p-3 space-y-1.5">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-2 text-sm">
              <span className="text-text-muted min-w-28">{h.label}</span>
              <span className="text-text-primary font-medium">{h.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Buy / Add to Bag buttons */}
      <div className="space-y-3" ref={addBtnRef}>
        <button
          onClick={handleBuy}
          disabled={!isAvailable}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-colors bg-btn-primary-bg text-btn-primary-text hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAvailable ? 'Buy this Item' : 'Unavailable'}
        </button>
        <button
          onClick={handleAddToBag}
          disabled={!isAvailable}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-colors bg-btn-outline-bg text-btn-outline-text border border-btn-outline-border hover:border-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAvailable ? 'Add to Bag' : 'Out of Stock'}
        </button>
      </div>

      {/* Chat / Wishlist / Share row */}
      <div className="flex items-center justify-center gap-8 py-3 border-t border-border-divider">
        <button className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors">
          <MessageCircle size={18} />
          <span>Chat</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors"
          onClick={() => toggleWishlist(product)}
        >
          <motion.div animate={{ scale: wished ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.25 }}>
            <Heart
              size={18}
              fill={wished ? '#EE4D2D' : 'none'}
              className={wished ? 'text-red-accent' : ''}
            />
          </motion.div>
          <span>Wishlist</span>
        </button>
        <button
          className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors"
          onClick={async () => {
            const url = window.location.href;
            const shareData = { title: product.name, text: `Check out ${product.name} on Shoppers!`, url };
            try {
              if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
              } else {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard');
              }
            } catch {
              /* user cancelled share sheet */
            }
          }}
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
