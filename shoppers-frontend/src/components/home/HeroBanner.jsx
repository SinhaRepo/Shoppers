import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    badge: '#Big Fashion Sale',
    title: 'Limited Time Offer!',
    subtitle: 'Up to 50% OFF!',
    description: 'Redefine Your Everyday Style',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80&fm=webp',
    cta: 'Shop Now',
    link: '/search?keyword=Clothing',
  },
  {
    badge: '#Tech Deals',
    title: 'Next-Gen Electronics',
    subtitle: 'Starting at 40% OFF!',
    description: 'Upgrade Your Digital Lifestyle',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80&fm=webp',
    cta: 'Shop Now',
    link: '/search?keyword=Electronics',
  },
  {
    badge: '#Sneaker Drop',
    title: 'Fresh Kicks Arrived!',
    subtitle: 'Flat 30% OFF!',
    description: 'Step Into the New Season',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fm=webp',
    cta: 'Shop Now',
    link: '/search?keyword=Shoes',
  },
];

const textVariants = {
  initial: { opacity: 0, y: 30 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const imageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
};

const HeroBanner = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 42vw, 420px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0 flex"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Left Panel — dark overlay with text */}
          <div className="w-full md:w-1/2 bg-[#1A1A2E] flex items-center relative z-10">
            <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-lg">
              <motion.span
                custom={0}
                variants={textVariants}
                className="inline-block bg-red-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-4"
              >
                {slide.badge}
              </motion.span>

              <motion.h1
                custom={1}
                variants={textVariants}
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2"
              >
                {slide.title}
              </motion.h1>

              <motion.h2
                custom={2}
                variants={textVariants}
                className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3"
              >
                {slide.subtitle}
              </motion.h2>

              <motion.p
                custom={3}
                variants={textVariants}
                className="text-[#CCCCCC] text-sm md:text-base mb-6"
              >
                {slide.description}
              </motion.p>

              <motion.button
                custom={4}
                variants={textVariants}
                onClick={() => navigate(slide.link)}
                className="inline-flex items-center gap-2 bg-btn-primary-bg text-btn-primary-text px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#222222] transition-colors"
              >
                {slide.cta}
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>

          {/* Right Panel — image */}
          <motion.div
            variants={imageVariants}
            className="hidden md:block w-1/2 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E] to-transparent w-24" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
