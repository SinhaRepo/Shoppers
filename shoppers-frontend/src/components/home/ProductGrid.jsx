import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';

const TABS = [
  { label: 'Best Seller', filter: null },
  { label: 'Keep Stylish', filter: ['Clothing', 'Shoes', 'Accessories'] },
  { label: 'Special Discount', filter: null, sort: 'price-asc' },
  { label: 'Official Store', filter: ['Electronics', 'Computers', 'Home Appliances'] },
  { label: 'Coveted Product', filter: ['Cameras', 'Audio', 'Wearables', 'Watches'] },
];

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ProductGrid = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const filtered = useMemo(() => {
    const tab = TABS[activeTab];
    let result = [...products];

    if (tab.filter) {
      result = result.filter((p) => tab.filter.includes(p.category));
    }

    if (tab.sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    }

    // Best Seller: sort by stock descending (popular = more sales = lower stock)
    if (activeTab === 0) {
      result.sort((a, b) => a.stockQuantity - b.stockQuantity);
    }

    return result.slice(0, 20);
  }, [products, activeTab]);

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section title */}
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Todays For You!
        </h2>

        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-border-divider mb-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                idx === activeTab
                  ? 'text-red-accent'
                  : 'text-text-tab-inactive hover:text-text-primary'
              }`}
            >
              {tab.label}
              {idx === activeTab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-tab-line"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            No products found in this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
