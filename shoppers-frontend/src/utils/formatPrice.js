/**
 * Format a number as Indian Rupee price string.
 * e.g. 134999 => "1,34,999"
 */
export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return '0';
  return Number(price).toLocaleString('en-IN');
};

/**
 * Calculate discount percentage between original and current price.
 * Returns integer percentage, e.g. 25
 */
export const getDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};
