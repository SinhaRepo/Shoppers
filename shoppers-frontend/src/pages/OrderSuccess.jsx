import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD${Date.now().toString(36).toUpperCase()}`;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-detail-savings-text" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 16 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold text-text-primary">
            Order Placed Successfully!
          </h1>

          <div className="bg-white rounded-xl border border-border-card p-5 text-left space-y-3">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-text-secondary" />
              <span className="text-sm text-text-muted">Order ID</span>
            </div>
            <p className="text-lg font-bold text-text-primary font-mono">{orderId}</p>

            <div className="border-t border-border-divider pt-3">
              <p className="text-sm text-text-secondary">
                Estimated delivery: <span className="font-medium text-text-primary">3-5 business days</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                You will receive order updates via email.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 border border-btn-outline-border text-btn-outline-text rounded-lg text-sm font-semibold hover:border-text-primary transition-colors text-center"
            >
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
