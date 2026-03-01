import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProducts, getProductImage } from '../api/productApi';
import { getCategoryImage } from '../utils/categoryPlaceholder';
import { formatPrice } from '../utils/formatPrice';
import HeroBanner from '../components/home/HeroBanner';
import CategoryIcons from '../components/home/CategoryIcons';
import FlashSale from '../components/home/FlashSale';
import ProductGrid from '../components/home/ProductGrid';
import BestSellingStore from '../components/home/BestSellingStore';
import { SkeletonGrid } from '../components/ui/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const sidebarTabs = [
  { label: 'Best Seller', filter: null },
  { label: 'Keep Stylish', filter: ['Clothing', 'Shoes', 'Accessories'] },
  { label: 'Special Discount', filter: null },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(0);

  const fetchProducts = () => {
    setLoading(true);
    setError(false);
    getAllProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sidebar products based on tab
  const sidebarProducts = (() => {
    const tab = sidebarTabs[sidebarTab];
    let result = [...products];
    if (tab.filter) {
      result = result.filter((p) => tab.filter.includes(p.category));
    }
    return result.slice(0, 6);
  })();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero Banner — full width */}
      <HeroBanner />

      {/* Category Icons Row */}
      <CategoryIcons />

      {/* Flash Sale */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <SkeletonGrid count={5} />
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-text-muted mb-3">Failed to load products</p>
          <button
            onClick={fetchProducts}
            className="px-5 py-2 rounded-lg bg-btn-primary-bg text-btn-primary-text text-sm font-medium hover:bg-black transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <FlashSale products={products} />
      )}

      {/* Todays For You + Right Sidebar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="py-6">
                <SkeletonGrid count={10} />
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>

          {/* Right sidebar — desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0 py-6">
            {/* Mini tabs */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto no-scrollbar">
              {sidebarTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setSidebarTab(idx)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    idx === sidebarTab
                      ? 'bg-bg-tab-active text-text-tab-active'
                      : 'text-text-tab-inactive hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mini product list */}
            <div className="space-y-3 mb-6">
              {sidebarProducts.map((product) => (
                <MiniProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Best Selling Store */}
            <BestSellingStore />
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

/* Compact product card for sidebar */
const MiniProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="flex gap-2.5 p-2 rounded-lg hover:bg-warm-beige transition-colors group"
    >
      <div className="w-14 h-14 bg-bg-card-image rounded-lg overflow-hidden flex-shrink-0">
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
        <p className="text-xs text-text-primary line-clamp-2 leading-snug group-hover:text-red-accent transition-colors">
          {product.name}
        </p>
        <p className="text-xs font-bold text-text-price mt-0.5">
          &#8377;{formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
};

export default Home;
