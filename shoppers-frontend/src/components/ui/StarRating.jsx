import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 12, showValue = true, count = null }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f-${i}`} size={size} className="text-star-filled fill-star-filled" />
        ))}
        {hasHalf && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-star-empty fill-star-empty absolute" />
            <div className="overflow-hidden absolute" style={{ width: size / 2 }}>
              <Star size={size} className="text-star-filled fill-star-filled" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-star-empty fill-star-empty" />
        ))}
      </div>
      {showValue && (
        <span className="text-text-muted" style={{ fontSize: size - 1 }}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-text-muted" style={{ fontSize: size - 1 }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
