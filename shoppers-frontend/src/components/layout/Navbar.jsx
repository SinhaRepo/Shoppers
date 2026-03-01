import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, ChevronDown, X, Menu, User, LogOut, Package, Shield } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { getAllProducts } from '../../api/productApi';

const CATEGORIES = [
  'Electronics',
  'Computers',
  'Shoes',
  'Clothing',
  'Watches',
  'Wearables',
  'Bags',
  'Cameras',
  'Audio',
  'Storage',
  'Accessories',
  'Home Appliances',
];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen, cartBounce } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, setIsLoginOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const categoryRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceRef = useRef(null);

  // Load all products once for search suggestions
  useEffect(() => {
    getAllProducts()
      .then((res) => setAllProducts(res.data))
      .catch(() => {});
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search suggestions
  const handleSearchInput = useCallback(
    (value) => {
      setSearchQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        const lower = value.toLowerCase();
        const matches = allProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p.brand.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower)
          )
          .slice(0, 6);
        setSuggestions(matches);
        setShowSuggestions(matches.length > 0);
      }, 300);
    },
    [allProducts]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-bg-navbar shadow-navbar">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-text-navbar"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="font-betania text-text-primary text-3xl shrink-0 leading-none">
          Shoppers
        </Link>

        {/* Category dropdown — desktop */}
        <div className="hidden lg:block relative" ref={categoryRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-1 px-3 py-2 text-sm text-text-navbar hover:text-text-primary transition-colors"
          >
            All Category
            <ChevronDown
              size={16}
              className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-border-input shadow-card-hover py-2 z-50"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      navigate(`/search?keyword=${encodeURIComponent(cat)}`);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-navbar hover:bg-warm-beige hover:text-text-primary transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search bar — hidden on mobile, visible md+ */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block flex-1 max-w-xl relative"
          ref={searchRef}
        >
          <div className="flex items-center border border-border-input rounded-lg bg-bg-input overflow-hidden focus-within:border-text-primary transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search product or brand here..."
              className="flex-1 px-4 py-2 text-sm text-text-primary placeholder:text-text-placeholder bg-transparent outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-btn-primary-bg text-btn-primary-text hover:bg-[#222222] transition-colors"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Search suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border-input shadow-card-hover py-2 z-50 max-h-80 overflow-y-auto"
              >
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setShowSuggestions(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-warm-beige transition-colors"
                  >
                    <div className="w-8 h-8 bg-bg-card-image rounded flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-text-primary line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-text-muted">{product.category}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Mobile search icon — visible only on mobile */}
          <button
            className="md:hidden text-[#555555] hover:text-text-primary transition-colors"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={22} />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 text-[#555555] hover:text-text-primary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-warm-beige flex items-center justify-center text-xs font-semibold text-text-secondary">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-border-input shadow-card-hover py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border-divider">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { navigate('/orders'); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-navbar hover:bg-warm-beige transition-colors"
                      >
                        <Package size={15} /> My Orders
                      </button>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => { navigate('/admin'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-navbar hover:bg-warm-beige transition-colors"
                        >
                          <Shield size={15} /> Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-accent hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-1.5 text-[#555555] hover:text-text-primary transition-colors"
              >
                <User size={22} />
              </button>
            )}
          </div>

          {/* Cart */}
          <motion.button
            animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            onClick={() => setIsCartOpen(true)}
            className="relative text-[#555555] hover:text-text-primary transition-colors"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-accent text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] h-[18px]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </motion.button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:flex relative text-[#555555] hover:text-text-primary transition-colors"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-accent text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] h-[18px]">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search bar — expands below navbar */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-border-divider overflow-hidden"
          >
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setShowMobileSearch(false);
              }}
              className="max-w-7xl mx-auto px-4 py-3 relative"
              ref={mobileSearchRef}
            >
              <div className="flex items-center border border-border-input rounded-lg bg-bg-input overflow-hidden focus-within:border-text-primary transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowMobileSearch(false);
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Search product or brand here..."
                  className="flex-1 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-placeholder bg-transparent outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setShowMobileSearch(false); setShowSuggestions(false); }}
                  className="px-3 py-2.5 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={18} />
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-btn-primary-bg text-btn-primary-text hover:bg-[#222222] transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Mobile search suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl border border-border-input shadow-card-hover py-2 z-50 max-h-64 overflow-y-auto"
                  >
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setShowSuggestions(false);
                          setShowMobileSearch(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-warm-beige transition-colors"
                      >
                        <div className="w-8 h-8 bg-bg-card-image rounded flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-sm text-text-primary line-clamp-1">{product.name}</p>
                          <p className="text-xs text-text-muted">{product.category}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-border-divider overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    navigate(`/search?keyword=${encodeURIComponent(cat)}`);
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-navbar hover:bg-warm-beige hover:text-text-primary transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
