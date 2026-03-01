import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const TopBar = () => {
  const { user, isAuthenticated, logout, setIsLoginOpen, setIsRegisterOpen } =
    useAuth();

  return (
    <div className="bg-bg-topbar border-b border-border-divider">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-text-topbar">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-text-primary transition-colors">
            <Download size={12} />
            <span>Download App</span>
          </button>
          <span className="hidden sm:inline text-border-divider">|</span>
          <span className="hidden sm:inline">Mitra Shoppers</span>
        </div>

        {/* Center links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/about" className="hover:text-text-primary transition-colors">
            About Shoppers
          </Link>
          <Link to="/contact" className="hover:text-text-primary transition-colors">
            Shoppers Care
          </Link>
          <a href="/#promotions" className="hover:text-text-primary transition-colors">
            Promo
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-text-primary font-medium truncate max-w-[80px] sm:max-w-[120px]">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="ml-2 px-3 py-1 rounded-lg border border-btn-outline-border text-btn-outline-text bg-btn-outline-bg hover:bg-warm-beige transition-colors text-xs font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-3 py-1 rounded-lg border border-btn-outline-border text-btn-outline-text bg-btn-outline-bg hover:bg-warm-beige transition-colors text-xs font-medium"
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-3 py-1 rounded-lg bg-btn-primary-bg text-btn-primary-text hover:bg-[#222222] transition-colors text-xs font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
