import { formatPrice } from '../../utils/formatPrice';

const PriceTag = ({
  price,
  originalPrice = null,
  discount = null,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { current: 'text-sm font-bold', original: 'text-xs', badge: 'text-xs px-1.5 py-0.5' },
    md: { current: 'text-[15px] font-bold', original: 'text-xs', badge: 'text-xs px-1.5 py-0.5' },
    lg: { current: 'text-2xl font-bold', original: 'text-sm', badge: 'text-sm px-2 py-0.5' },
  };

  const s = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-text-price ${s.current}`}>
        &#8377;{formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={`text-text-original line-through ${s.original}`}>
          &#8377;{formatPrice(originalPrice)}
        </span>
      )}
      {discount && discount > 0 && (
        <span className={`bg-red-badge text-white rounded ${s.badge} font-semibold`}>
          {discount}% off
        </span>
      )}
    </div>
  );
};

export default PriceTag;
