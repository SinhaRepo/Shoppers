import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TShirtIcon,
  JacketIcon,
  ShirtIcon,
  JeansIcon,
  BagIcon,
  ShoeIcon,
  WatchIcon,
  CapIcon,
  GridIcon,
} from '../ui/CategorySVGs';

const categories = [
  { label: 'T-Shirt', Icon: TShirtIcon, keyword: 'T-Shirt' },
  { label: 'Jacket', Icon: JacketIcon, keyword: 'Jacket' },
  { label: 'Shirt', Icon: ShirtIcon, keyword: 'Shirt' },
  { label: 'Jeans', Icon: JeansIcon, keyword: 'Jeans' },
  { label: 'Bag', Icon: BagIcon, keyword: 'Bags' },
  { label: 'Shoes', Icon: ShoeIcon, keyword: 'Shoes' },
  { label: 'Watches', Icon: WatchIcon, keyword: 'Watches' },
  { label: 'Cap', Icon: CapIcon, keyword: 'Cap' },
  { label: 'All Category', Icon: GridIcon, keyword: '' },
];

const CategoryIcons = () => {
  const navigate = useNavigate();

  const handleClick = (keyword) => {
    if (keyword) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/search?keyword=');
    }
  };

  return (
    <div className="bg-white border-y border-border-divider">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {categories.map(({ label, Icon, keyword }) => (
            <motion.button
              key={label}
              onClick={() => handleClick(keyword)}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 min-w-[72px] group"
            >
              <div className="w-14 h-14 rounded-full bg-bg-category border border-border-category flex items-center justify-center text-[#555555] group-hover:border-red-accent group-hover:text-red-accent transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-text-secondary group-hover:text-red-accent transition-colors whitespace-nowrap font-medium">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryIcons;
