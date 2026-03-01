import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProductById, getRelatedProducts } from '../api/productApi';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import SellerCard from '../components/product/SellerCard';
import ReviewSection from '../components/product/ReviewSection';
import RelatedProducts from '../components/product/RelatedProducts';
import { SkeletonGrid } from '../components/ui/LoadingSpinner';
import { ATTRIBUTE_LABELS } from '../utils/categoryAttributes';
import { useCart as useCartHook } from '../hooks/useCart';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const TABS = ['Description', 'Styling Ideas', 'Review', 'Best Seller'];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addBtnRef = useRef(null);

  // Fetch product and all products
  const fetchData = () => {
    setLoading(true);
    setError(false);
    setActiveTab(0);
    Promise.all([getProductById(id), getRelatedProducts(id)])
      .then(([prodRes, relRes]) => {
        setProduct(prodRes.data);
        setRelatedProducts(relRes.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Sticky bar with IntersectionObserver — re-attaches when product loads
  useEffect(() => {
    if (!product || !addBtnRef.current) return;
    const target = addBtnRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [product]);

  if (loading) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-4 bg-bg-skeleton rounded w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="aspect-square bg-bg-skeleton rounded-xl animate-pulse" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-8 bg-bg-skeleton rounded w-3/4" />
              <div className="h-4 bg-bg-skeleton rounded w-1/2" />
              <div className="h-10 bg-bg-skeleton rounded w-1/3" />
              <div className="h-12 bg-bg-skeleton rounded w-full mt-6" />
              <div className="h-12 bg-bg-skeleton rounded w-full" />
            </div>
            <div className="lg:col-span-3">
              <SkeletonGrid count={3} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          {error ? (
            <>
              <h1 className="text-xl font-bold text-text-primary">Failed to load product</h1>
              <p className="text-text-secondary mt-2">Please check your connection and try again.</p>
              <button
                onClick={fetchData}
                className="inline-block mt-4 px-5 py-2 rounded-lg bg-btn-primary-bg text-btn-primary-text text-sm font-medium hover:bg-black transition-colors"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-text-primary">Product Not Found</h1>
              <p className="text-text-secondary mt-2">This product does not exist or has been removed.</p>
              <Link to="/" className="inline-block mt-4 text-sm font-medium text-red-accent hover:text-red-accent-dark">
                Back to Home
              </Link>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // Related products from API

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1 text-[13px] text-text-muted">
          <Link to="/" className="hover:text-red-accent transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link
            to={`/search?keyword=${encodeURIComponent(product.category)}`}
            className="hover:text-red-accent transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight size={13} />
          <span className="text-text-primary truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left — Image Gallery */}
          <div className="lg:col-span-5">
            <ProductImageGallery product={product} />
          </div>

          {/* Center — Product Info */}
          <div className="lg:col-span-4">
            <ProductInfo product={product} addToRef={addBtnRef} />

            {/* Seller Card */}
            <div className="mt-5">
              <SellerCard product={product} />
            </div>
          </div>

          {/* Right Sidebar — Related Products */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <RelatedProducts products={relatedProducts} currentId={product.id} />
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-10">
          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-border-divider pb-0">
            {TABS.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative ${
                  idx === activeTab
                    ? 'bg-bg-tab-active text-text-tab-active'
                    : 'text-text-tab-inactive hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === 0 && <DescriptionTab product={product} />}
            {activeTab === 1 && <StylingIdeasTab />}
            {activeTab === 2 && <ReviewSection product={product} />}
            {activeTab === 3 && (
              <div className="text-sm text-text-secondary">
                Best seller information for {product.category} category products.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Add to Bag bar */}
      <AnimatePresence>
        {showStickyBar && product.productAvailable && product.stockQuantity > 0 && (
          <StickyBar product={product} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* Description tab content */
const DescriptionTab = ({ product }) => {
  const attrs = useMemo(() => {
    if (!product.attributes) return {};
    try { return JSON.parse(product.attributes); } catch { return {}; }
  }, [product.attributes]);

  const baseRows = [
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category },
    { label: 'Date First Available', value: product.releaseDate || 'N/A' },
    { label: 'Availability', value: product.productAvailable ? 'In Stock' : 'Out of Stock' },
    { label: 'Stock Quantity', value: product.stockQuantity },
  ];

  /* Build attribute rows from JSON */
  const attrRows = Object.entries(attrs)
    .filter(([, v]) => v && String(v).trim())
    .map(([key, value]) => ({
      label: ATTRIBUTE_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value,
    }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary leading-relaxed">
        {product.description}
      </p>

      {/* Product Details */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2">Product Details</h3>
        <table className="w-full max-w-lg text-sm">
          <tbody>
            {baseRows.map((row) => (
              <tr key={row.label} className="border-b border-border-divider">
                <td className="py-2.5 text-text-muted font-medium w-56">{row.label}</td>
                <td className="py-2.5 text-text-primary">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Specifications from attributes JSON */}
      {attrRows.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Specifications</h3>
          <table className="w-full max-w-lg text-sm">
            <tbody>
              {attrRows.map((row) => (
                <tr key={row.label} className="border-b border-border-divider">
                  <td className="py-2.5 text-text-muted font-medium w-56">{row.label}</td>
                  <td className="py-2.5 text-text-primary">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* Styling Ideas tab */
const StylingIdeasTab = () => (
  <div className="text-sm text-text-secondary leading-relaxed space-y-3">
    <p>
      Pair this item with complementary pieces from our collection for a complete look.
      Mix textures and tones to create outfits that transition seamlessly from day to night.
    </p>
    <p>
      Layer with neutral-toned basics for a refined everyday aesthetic, or combine with
      bold statement pieces for a standout look. The versatility of this product makes it
      a wardrobe essential.
    </p>
  </div>
);

/* Sticky bottom bar */
const StickyBar = ({ product }) => {
  const { addToCart } = useCartHook();

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      exit={{ y: 80 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-card shadow-drawer px-4 py-3 flex items-center justify-between"
    >
      <div>
        <p className="font-semibold text-sm text-text-primary truncate max-w-xs">
          {product.name}
        </p>
        <p className="font-bold text-text-price">
          &#8377;{product.price?.toLocaleString('en-IN')}
        </p>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="bg-btn-primary-bg text-btn-primary-text px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
      >
        Add to Bag
      </button>
    </motion.div>
  );
};

export default ProductDetail;
