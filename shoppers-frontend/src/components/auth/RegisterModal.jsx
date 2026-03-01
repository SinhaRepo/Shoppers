import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const RegisterModal = () => {
  const { isRegisterOpen, setIsRegisterOpen, setIsLoginOpen, register, loading } =
    useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return;
    }
    await register(name, email, password);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <AnimatePresence>
      {isRegisterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsRegisterOpen(false)}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setIsRegisterOpen(false)
            }
          >
            <div className="bg-white rounded-2xl shadow-drawer w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-text-primary mb-1">
                Create account
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Join Shoppers today
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-border-input bg-bg-input text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:border-text-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-border-input bg-bg-input text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:border-text-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                      className="w-full px-3 py-2.5 rounded-lg border border-border-input bg-bg-input text-sm text-text-primary placeholder:text-text-placeholder outline-none focus:border-text-primary transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-btn-primary-bg text-btn-primary-text font-medium text-sm hover:bg-[#222222] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>

              <p className="text-sm text-text-secondary text-center mt-5">
                Already have an account?{' '}
                <button
                  onClick={switchToLogin}
                  className="text-red-accent font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
