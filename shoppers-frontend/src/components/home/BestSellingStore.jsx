import { Star, MapPin } from 'lucide-react';

const stores = [
  {
    name: 'TechHub Official',
    rating: 4.9,
    location: 'New Delhi',
    products: 245,
    color: 'bg-blue-100',
  },
  {
    name: 'FashionVault',
    rating: 4.8,
    location: 'Mumbai',
    products: 189,
    color: 'bg-pink-100',
  },
  {
    name: 'SneakerStreet',
    rating: 4.7,
    location: 'Bangalore',
    products: 132,
    color: 'bg-amber-100',
  },
  {
    name: 'GadgetWorld',
    rating: 4.8,
    location: 'Hyderabad',
    products: 311,
    color: 'bg-emerald-100',
  },
];

const BestSellingStore = () => {
  return (
    <div>
      <h3 className="text-sm font-bold text-text-primary mb-3">
        Best Selling Store
      </h3>
      <div className="space-y-3">
        {stores.map((store) => (
          <div
            key={store.name}
            className="bg-white rounded-xl border border-border-card p-3 hover:shadow-card transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full ${store.color} flex items-center justify-center text-sm font-bold text-text-primary`}
              >
                {store.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {store.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="flex items-center gap-0.5">
                    <Star size={10} className="text-star-filled fill-star-filled" />
                    {store.rating}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} />
                    {store.location}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">
              {store.products} Products
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingStore;
