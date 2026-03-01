import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { getProductImage } from '../../api/productApi';
import { getCategoryImage } from '../../utils/categoryPlaceholder';

const ProductImageGallery = ({ product }) => {
  /*
   * Build image list from product.imageUrl1–imageUrl5.
   * Fallbacks: API blob endpoint for image 1, then category placeholder.
   */
  const categoryImg = getCategoryImage(product.category);
  const apiImg = getProductImage(product.id);

  const images = useMemo(() => {
    const urls = [
      product.imageUrl1,
      product.imageUrl2,
      product.imageUrl3,
      product.imageUrl4,
      product.imageUrl5,
    ].filter(Boolean); // remove null / empty

    if (urls.length > 0) return urls;

    /* No URLs set — fall back to blob API + category placeholder */
    return [apiImg, categoryImg];
  }, [product, apiImg, categoryImg]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState({});
  const [zoomed, setZoomed] = useState(false);

  const handleError = (idx) => {
    setImgError((prev) => ({ ...prev, [idx]: true }));
  };

  const getImgSrc = (idx) => (imgError[idx] ? categoryImg : images[idx]);

  return (
    <div className="flex gap-3">
      {/* Vertical thumbnail strip */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
              idx === activeIdx
                ? 'border-red-accent'
                : 'border-border-card hover:border-warm-tan'
            }`}
          >
            <img
              src={getImgSrc(idx)}
              alt={`${product.name} view ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleError(idx)}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className="bg-bg-card-image rounded-xl overflow-hidden aspect-square relative cursor-pointer"
          onClick={() => setZoomed(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={getImgSrc(activeIdx)}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={() => handleError(activeIdx)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          {/* Zoom icon bottom-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(true);
            }}
            className="absolute bottom-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-card hover:bg-white transition-colors"
          >
            <ZoomIn size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* Zoom overlay */}
        <AnimatePresence>
          {zoomed && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50"
                onClick={() => setZoomed(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-8"
                onClick={() => setZoomed(false)}
              >
                <img
                  src={getImgSrc(activeIdx)}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductImageGallery;
