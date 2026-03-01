import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { X, SlidersHorizontal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { searchProducts, getAllProducts } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/ui/LoadingSpinner';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' },
];

const PRICE_RANGES = [
  { label: 'Under 1,000', min: 0, max: 1000 },
  { label: '1,000 - 5,000', min: 1000, max: 5000 },
  { label: '5,000 - 15,000', min: 5000, max: 15000 },
  { label: '15,000 - 50,000', min: 15000, max: 50000 },
  { label: '50,000 - 1,50,000', min: 50000, max: 150000 },
];

const SearchResults = () => {
  const [params] = useSearchParams();
  const keyword = params.get('keyword') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('relevance');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
    availability: true,
  });

  useEffect(() => {
    setLoading(true);
    const fetcher = keyword.trim()
      ? searchProducts(keyword)
      : getAllProducts();
    fetcher
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [keyword]);

  // Extract unique categories and brands
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    if (inStockOnly) {
      result = result.filter((p) => p.productAvailable && p.stockQuantity > 0);
    }
    // Rating filter — uses real avgRating from API
    if (minRating > 0) {
      result = result.filter((p) => (p.avgRating ?? 0) >= minRating);
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'rating':
        result.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategories, selectedBrands, selectedPriceRange, minRating, inStockOnly, sort]);

  // Active filter chips
  const activeFilters = [];
  selectedCategories.forEach((c) =>
    activeFilters.push({ label: c, clear: () => setSelectedCategories((prev) => prev.filter((x) => x !== c)) })
  );
  selectedBrands.forEach((b) =>
    activeFilters.push({ label: b, clear: () => setSelectedBrands((prev) => prev.filter((x) => x !== b)) })
  );
  if (selectedPriceRange !== null) {
    activeFilters.push({
      label: PRICE_RANGES[selectedPriceRange].label,
      clear: () => setSelectedPriceRange(null),
    });
  }
  if (minRating > 0) {
    activeFilters.push({ label: `${minRating}+ Stars`, clear: () => setMinRating(0) });
  }
  if (inStockOnly) {
    activeFilters.push({ label: 'In Stock Only', clear: () => setInStockOnly(false) });
  }

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setMinRating(0);
    setInStockOnly(false);
  };

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  /* Filter sidebar content — reused for desktop and mobile */
  const FilterContent = () => (
    <div className="space-y-5">
      {/* Category */}
      <FilterSection
        title="Category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="w-4 h-4 rounded accent-red-accent"
            />
            <span className="text-sm text-text-secondary">{cat}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        {PRICE_RANGES.map((range, idx) => (
          <label key={range.label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === idx}
              onChange={() => setSelectedPriceRange(idx)}
              className="w-4 h-4 accent-red-accent"
            />
            <span className="text-sm text-text-secondary">&#8377;{range.label}</span>
          </label>
        ))}
        {selectedPriceRange !== null && (
          <button
            onClick={() => setSelectedPriceRange(null)}
            className="text-xs text-red-accent hover:text-red-accent-dark"
          >
            Clear price filter
          </button>
        )}
      </FilterSection>

      {/* Brand */}
      <FilterSection
        title="Brand"
        expanded={expandedSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        {brands.map((brand) => (
          <label key={brand} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
              className="w-4 h-4 rounded accent-red-accent"
            />
            <span className="text-sm text-text-secondary">{brand}</span>
          </label>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection
        title="Rating"
        expanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        {[4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setMinRating(minRating === r ? 0 : r)}
            className={`flex items-center gap-1.5 text-sm py-0.5 ${
              minRating === r ? 'text-text-primary font-medium' : 'text-text-secondary'
            }`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < r ? 'text-star-filled fill-star-filled' : 'text-star-empty fill-star-empty'}
              />
            ))}
            <span>& up</span>
          </button>
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection
        title="Availability"
        expanded={expandedSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="w-4 h-4 rounded accent-red-accent"
          />
          <span className="text-sm text-text-secondary">In Stock Only</span>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {keyword ? `Results for "${keyword}"` : 'All Products'}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm border border-border-card rounded-lg text-text-secondary hover:border-text-primary transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 text-sm border border-border-card rounded-lg bg-white text-text-primary focus:outline-none focus:border-text-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {activeFilters.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-warm-beige text-text-primary rounded-full"
              >
                {f.label}
                <button onClick={f.clear} className="hover:text-red-accent">
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-accent hover:text-red-accent-dark font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-1.5">
                <SlidersHorizontal size={16} />
                Filters
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid count={12} />
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-semibold text-text-primary">No products found</p>
                <p className="text-sm text-text-muted mt-1">
                  Try adjusting your filters or search with different keywords.
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                initial="initial"
                animate="animate"
                variants={{ animate: { transition: { staggerChildren: 0.04 } } }}
              >
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-white z-50 overflow-y-auto p-5 shadow-drawer lg:hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-text-primary">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 hover:bg-warm-beige rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <FilterContent />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

/* Collapsible filter section */
const FilterSection = ({ title, expanded, onToggle, children }) => (
  <div>
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-sm font-semibold text-text-primary mb-2"
    >
      {title}
      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {expanded && <div className="space-y-2 pl-0.5">{children}</div>}
  </div>
);

export default SearchResults;
