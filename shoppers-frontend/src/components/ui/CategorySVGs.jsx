/* Category SVG Icons — clean line-art style, NO emojis */

export const TShirtIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l-5 5 3 2v11h12V9l3-2-5-5" />
    <path d="M8 2c.5 1 1.79 2 4 2s3.5-1 4-2" />
  </svg>
);

export const JacketIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l-5 5v13h6v-7h6v7h6V7l-5-5" />
    <path d="M8 2c.5 1.5 1.79 3 4 3s3.5-1.5 4-3" />
    <line x1="12" y1="5" x2="12" y2="13" />
  </svg>
);

export const ShirtIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l-4.5 4.5L6 9V20h12V9l2.5-2.5L16 2" />
    <path d="M8 2c.5 1 1.79 2 4 2s3.5-1 4-2" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

export const JeansIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h12v6l-2 1v13H8V9L6 8V2z" />
    <line x1="12" y1="9" x2="12" y2="22" />
    <line x1="6" y1="2" x2="18" y2="2" />
  </svg>
);

export const BagIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1.5 12H6.5L5 8z" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
  </svg>
);

export const ShoeIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18h18v1H3z" />
    <path d="M4 18c0-2 1-4 3-5l2-1c2-1 3-3 3-5h2c0 3-2 5-4 6l-2 1c-1 .5-2 2-2 4" />
    <path d="M14 7c2 0 4 1 5 3l2 3v5" />
  </svg>
);

export const WatchIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="6" />
    <path d="M12 6V2M12 22v-4" />
    <path d="M9 3h6M9 21h6" />
    <polyline points="12,9 12,12 14.5,13.5" />
  </svg>
);

export const CapIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14c0-4 3.58-7 8-7s8 3 8 7" />
    <path d="M2 14h20" />
    <path d="M20 14c1 .5 2 1.5 2 3H2" />
    <ellipse cx="12" cy="8" rx="3" ry="1" />
  </svg>
);

export const GridIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const categoryIconMap = {
  'T-Shirt': TShirtIcon,
  'Jacket': JacketIcon,
  'Shirt': ShirtIcon,
  'Jeans': JeansIcon,
  'Bag': BagIcon,
  'Shoes': ShoeIcon,
  'Watches': WatchIcon,
  'Cap': CapIcon,
  'All Category': GridIcon,
};
