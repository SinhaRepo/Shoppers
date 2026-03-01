import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

/* Rating bar chart */
const RatingBars = ({ reviews }) => {
  const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
  });
  const total = reviews.length || 1;
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="flex gap-6 items-start">
      <div className="text-center flex-shrink-0">
        <p className="text-4xl font-bold text-text-primary">{avg}</p>
        <StarRating rating={Number(avg)} size={14} showValue={false} />
        <p className="text-xs text-text-muted mt-1">{reviews.length} reviews</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-xs text-text-muted w-3 text-right">{star}</span>
            <Star size={10} className="text-star-filled fill-star-filled flex-shrink-0" />
            <div className="flex-1 h-2 bg-border-divider rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-star-filled rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(counts[star - 1] / total) * 100}%` }}
                transition={{ duration: 0.6, delay: star * 0.05 }}
              />
            </div>
            <span className="text-xs text-text-muted w-6">{counts[star - 1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Single review card */
const ReviewCard = ({ review, onHelpful }) => {
  return (
    <div className="py-4 border-b border-border-divider last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-warm-beige flex items-center justify-center flex-shrink-0 text-sm font-semibold text-text-secondary">
          {(review.userName || 'A').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">{review.userName || 'Anonymous'}</p>
            <p className="text-xs text-text-muted">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
            </p>
          </div>
          {review.title && (
            <p className="text-sm font-medium text-text-primary mt-0.5">{review.title}</p>
          )}
          <div className="mt-1">
            <StarRating rating={review.rating} size={11} showValue={false} />
          </div>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">{review.body}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onHelpful(review.id)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <ThumbsUp size={13} />
              <span>{review.helpfulCount ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ product }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/products/${product.id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [product.id]);

  const displayReviews = showAll ? reviews : reviews.slice(0, 4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (body.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }
    if (!title.trim()) {
      toast.error('Please add a title');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/products/${product.id}/reviews`, {
        rating,
        title: title.trim(),
        body: body.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      setRating(0);
      setTitle('');
      setBody('');
      setShowForm(false);
      toast.success('Review submitted');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const res = await axiosInstance.put(`/reviews/${reviewId}/helpful`);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? res.data : r))
      );
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="space-y-6">
      <RatingBars reviews={reviews} />

      {isAuthenticated && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-medium text-red-accent hover:text-red-accent-dark transition-colors"
        >
          Write a Review
        </button>
      )}
      {!isAuthenticated && (
        <p className="text-sm text-text-muted">Log in to write a review.</p>
      )}

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-warm-beige rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-star-filled fill-star-filled'
                      : 'text-star-empty fill-star-empty'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-text-muted ml-2">{rating}/5</span>
            )}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title"
            className="w-full px-3 py-2 text-sm bg-white border border-border-input rounded-lg focus:outline-none focus:border-text-primary"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full h-24 px-3 py-2 text-sm bg-white border border-border-input rounded-lg focus:outline-none focus:border-text-primary resize-none"
          />

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-btn-primary-bg text-btn-primary-text rounded-lg hover:bg-black transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div>
        {loading ? (
          <p className="text-sm text-text-muted py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-text-muted py-4">No reviews yet. Be the first to review!</p>
        ) : (
          displayReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
          ))
        )}
      </div>

      {reviews.length > 4 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 text-sm font-medium text-text-secondary border border-border-card rounded-lg hover:border-text-primary transition-colors"
        >
          See All Reviews ({reviews.length})
        </button>
      )}
    </div>
  );
};

export default ReviewSection;
