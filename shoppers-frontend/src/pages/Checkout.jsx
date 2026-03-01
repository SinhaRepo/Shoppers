import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Smartphone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { getProductImage } from '../api/productApi';
import { getCategoryImage } from '../utils/categoryPlaceholder';
import { formatPrice } from '../utils/formatPrice';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
  { id: 'card', label: 'Card Payment', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin: '',
  });
  const [payment, setPayment] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pin'];
    const missing = required.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      toast.error('Please fill all delivery fields');
      return;
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone: 10 digits (Indian format)
    if (!/^\d{10}$/.test(form.phone.replace(/[\s-]/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // PIN: 6 digits (Indian format)
    if (!/^\d{6}$/.test(form.pin.trim())) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    setSubmitting(true);

    try {
      // Build order request for backend
      const orderPayload = {
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        paymentMethod: payment,
        deliveryName: form.name,
        deliveryEmail: form.email,
        deliveryPhone: form.phone.replace(/[\s-]/g, ''),
        deliveryAddress: form.address,
        deliveryCity: form.city,
        deliveryState: form.state,
        deliveryPin: form.pin.trim(),
      };

      // Place order on backend
      const orderRes = await axiosInstance.post('/orders', orderPayload);
      const order = orderRes.data;

      if (payment === 'cod') {
        // COD — order is placed, go to success
        clearCart();
        navigate('/order-success', { state: { orderId: order.id } });
      } else {
        // Card / UPI — open Razorpay checkout
        const rpRes = await axiosInstance.post('/payment/create-order', {
          orderId: order.id,
          amount: order.totalAmount,
        });

        const { razorpayOrderId, razorpayKeyId, amount, currency } = rpRes.data;

        const options = {
          key: razorpayKeyId,
          amount,
          currency,
          name: 'Shoppers',
          description: `Order #${order.id}`,
          order_id: razorpayOrderId,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone.replace(/[\s-]/g, ''),
          },
          theme: { color: '#111111' },
          handler: async (response) => {
            try {
              await axiosInstance.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: String(order.id),
              });
              clearCart();
              navigate('/order-success', { state: { orderId: order.id } });
            } catch {
              toast.error('Payment verification failed');
              setSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled');
              setSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return; // Don't setSubmitting(false) here — Razorpay handles flow
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to place order';
      toast.error(typeof msg === 'string' ? msg : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const totalOriginal = cart.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity,
    0
  );
  const savings = totalOriginal - cartTotal;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-text-primary mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left — Delivery + Payment */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-xl border border-border-card p-5">
                <h2 className="text-sm font-bold text-text-primary mb-4">Delivery Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-text-muted mb-1">Address</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">PIN Code</label>
                    <input
                      name="pin"
                      value={form.pin}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary bg-bg-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-border-card p-5">
                <h2 className="text-sm font-bold text-text-primary mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          payment === method.id
                            ? 'border-text-primary bg-warm-white'
                            : 'border-border-card hover:border-warm-tan'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={payment === method.id}
                          onChange={() => setPayment(method.id)}
                          className="accent-red-accent"
                        />
                        <Icon size={18} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">{method.label}</span>
                      </label>
                    );
                  })}
                </div>

                {(payment === 'card' || payment === 'upi') && (
                  <div className="mt-4 p-3 bg-warm-beige rounded-lg">
                    <p className="text-xs text-text-muted">
                      Secure payment powered by Razorpay. Test mode — no real charges will be made.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-border-card p-5 sticky top-24">
                <h2 className="text-sm font-bold text-text-primary mb-4">Order Summary</h2>

                {/* Mini product list */}
                <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar mb-4">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-bg-card-image overflow-hidden flex-shrink-0">
                        <img
                          src={product.imageUrl1 || getProductImage(product.id)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getCategoryImage(product.category);
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-primary line-clamp-1">{product.name}</p>
                        <p className="text-xs text-text-muted">Qty: {quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-text-price flex-shrink-0">
                        &#8377;{formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border-divider pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal ({cartCount})</span>
                    <span>&#8377;{formatPrice(totalOriginal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Discount</span>
                    <span className="text-detail-savings-text">-&#8377;{formatPrice(savings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Delivery</span>
                    <span className="text-detail-savings-text">Free</span>
                  </div>
                </div>

                <div className="border-t border-border-divider mt-3 pt-3 flex justify-between items-center">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="text-lg font-bold text-text-price">&#8377;{formatPrice(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-5 py-3 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Checkout;
