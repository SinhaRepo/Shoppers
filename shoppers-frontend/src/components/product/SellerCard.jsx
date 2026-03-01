import { CheckCircle } from 'lucide-react';

const SellerCard = ({ product }) => {
  // Use brand as the seller name when available
  const storeName = product.brand || 'Shoppers Official';
  const initial = storeName.charAt(0).toUpperCase();

  return (
    <div className="bg-bg-seller-card rounded-xl p-4 border border-border-divider">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-warm-beige flex items-center justify-center flex-shrink-0 text-lg font-bold text-text-secondary">
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-text-primary text-sm truncate">
              {storeName}
            </span>
            <CheckCircle size={14} className="text-detail-verified flex-shrink-0" fill="#1A73E8" stroke="white" />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-detail-online-dot inline-block" />
            <span className="text-xs text-text-muted">Verified Seller</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button className="flex-1 py-2 text-xs font-semibold rounded-lg border border-btn-outline-border text-btn-outline-text hover:border-text-primary transition-colors">
          Follow
        </button>
        <button className="flex-1 py-2 text-xs font-semibold rounded-lg border border-btn-outline-border text-btn-outline-text hover:border-text-primary transition-colors">
          Visit Store
        </button>
      </div>
    </div>
  );
};

export default SellerCard;
