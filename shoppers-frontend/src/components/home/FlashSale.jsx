import { useRef } from 'react';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import ProductCard from '../product/ProductCard';

const FlashSale = ({ products = [] }) => {
  const scrollRef = useRef(null);
  /* Promo anchor — TopBar "Promo" link scrolls here via /#promotions */

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Take first 12 available products for flash sale
  const flashProducts = products
    .filter((p) => p.productAvailable && p.stockQuantity > 0)
    .slice(0, 12);

  if (flashProducts.length === 0) return null;

  return (
    <section id="promotions" className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Zap size={20} className="text-red-accent fill-red-accent" />
              <h2 className="text-lg font-bold text-text-primary">Flash Sale</h2>
            </div>
            <CountdownTimer />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border-card bg-white text-[#555555] hover:bg-warm-beige transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border-card bg-white text-[#555555] hover:bg-warm-beige transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
        >
          {flashProducts.map((product) => (
            <div key={product.id} className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] flex-shrink-0 h-auto">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
