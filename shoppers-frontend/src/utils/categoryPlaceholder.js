const placeholders = {
  'Electronics':     'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=70&fm=webp',
  'Computers':       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=70&fm=webp',
  'Shoes':           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=70&fm=webp',
  'Clothing':        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=70&fm=webp',
  'Watches':         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=70&fm=webp',
  'Bags':            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=70&fm=webp',
  'Cameras':         'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=70&fm=webp',
  'Audio':           'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=70&fm=webp',
  'Wearables':       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=70&fm=webp',
  'Accessories':     'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=70&fm=webp',
  'Home Appliances': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70&fm=webp',
  'Storage':         'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&q=70&fm=webp',
  default:           'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=70&fm=webp',
};

export const getCategoryImage = (category) =>
  placeholders[category] || placeholders.default;
