import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const NotFound = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <SearchX size={72} className="mx-auto text-warm-greige mb-5" strokeWidth={1.5} />
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <p className="text-lg text-text-secondary mb-1">Page Not Found</p>
      <p className="text-sm text-text-muted mb-8 max-w-md mx-auto">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/search"
          className="px-6 py-3 border border-btn-outline-border text-btn-outline-text rounded-lg text-sm font-semibold hover:border-text-primary transition-colors"
        >
          Search Products
        </Link>
      </div>
    </div>
  </motion.div>
);

export default NotFound;
