import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const STATUS_COLORS = {
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await axiosInstance.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? res.data : o))
      );
      toast.success('Order cancelled');
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-text-muted">Loading orders...</p>
        </div>
      </motion.div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-warm-greige mb-4" />
          <h1 className="text-xl font-bold text-text-primary">No orders yet</h1>
          <p className="text-sm text-text-muted mt-2">
            When you place an order, it will appear here.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-text-primary mb-6">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-border-card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-warm-white transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Package size={20} className="text-text-secondary flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text-primary font-mono">
                      #{order.id}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted hidden sm:inline">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-bold text-text-price">
                    &#8377;{formatPrice(order.totalAmount)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  {expanded === order.id ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border-divider pt-3">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Link
                                to={`/product/${item.productId}`}
                                className="text-text-primary hover:text-red-accent transition-colors truncate"
                              >
                                {item.productName}
                              </Link>
                              <span className="text-text-muted flex-shrink-0">x{item.quantity}</span>
                            </div>
                            <span className="text-text-price font-medium flex-shrink-0 ml-4">
                              &#8377;{formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-border-divider text-xs text-text-muted">
                        <p>
                          Delivery: {order.deliveryName}, {order.deliveryAddress},{' '}
                          {order.deliveryCity}, {order.deliveryState} - {order.deliveryPin}
                        </p>
                        <p className="mt-0.5">
                          Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus})
                        </p>
                      </div>

                      {order.status === 'PROCESSING' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="mt-3 text-xs text-red-accent hover:underline"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderHistory;
