import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ShoppingBag,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
} from '../api/productApi';
import { getCategoryImage } from '../utils/categoryPlaceholder';
import { getFieldsForCategory } from '../utils/categoryAttributes';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const CATEGORIES = [
  'Electronics',
  'Computers',
  'Shoes',
  'Clothing',
  'Watches',
  'Wearables',
  'Bags',
  'Cameras',
  'Audio',
  'Storage',
  'Home Appliances',
  'Accessories',
];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'add', label: 'Add Product', icon: PlusCircle },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

const emptyProduct = {
  name: '',
  brand: '',
  description: '',
  price: '',
  category: '',
  stockQuantity: '',
  releaseDate: '',
  productAvailable: true,
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    getAllProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setActiveTab('edit');
  };

  // Stats
  const totalProducts = products.length;
  const uniqueCategories = new Set(products.map((p) => p.category)).size;
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 20).length;
  const outOfStock = products.filter((p) => !p.productAvailable || p.stockQuantity === 0).length;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <aside className="w-56 bg-bg-footer flex-shrink-0">
          <div className="p-5">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'BetaniaPatmos', serif" }}
            >
              Shoppers
            </h2>
            <p className="text-xs text-text-footer mt-0.5">Admin Panel</p>
          </div>

          <nav className="mt-2 px-3 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-red-accent/15 text-white border-l-2 border-red-accent'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-warm-white p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              totalProducts={totalProducts}
              uniqueCategories={uniqueCategories}
              lowStock={lowStock}
              outOfStock={outOfStock}
            />
          )}
          {activeTab === 'products' && (
            <ProductsTable
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {activeTab === 'add' && (
            <ProductForm
              mode="add"
              onSuccess={() => {
                fetchProducts();
                setActiveTab('products');
              }}
            />
          )}
          {activeTab === 'edit' && editingProduct && (
            <ProductForm
              mode="edit"
              initialData={editingProduct}
              onSuccess={() => {
                fetchProducts();
                setEditingProduct(null);
                setActiveTab('products');
              }}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
            />
          )}
          {activeTab === 'orders' && <OrdersManager />}
        </main>
      </div>
    </motion.div>
  );
};

/* Dashboard stats */
const DashboardView = ({ totalProducts, uniqueCategories, lowStock, outOfStock }) => {
  const stats = [
    { label: 'Total Products', value: totalProducts, color: 'bg-blue-50 text-blue-700' },
    { label: 'Categories', value: uniqueCategories, color: 'bg-green-50 text-green-700' },
    { label: 'Low Stock', value: lowStock, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Out of Stock', value: outOfStock, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-text-primary mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border-card p-5">
            <p className="text-xs text-text-muted uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color} inline-block px-2 py-1 rounded-lg`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Products table */
const ProductsTable = ({ products, loading, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-text-primary">Products ({products.length})</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-border-input rounded-lg bg-white focus:outline-none focus:border-text-primary w-64"
        />
      </div>

      <div className="bg-white rounded-xl border border-border-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-warm-beige">
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Brand
                </th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Category
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Price
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Stock
                </th>
                <th className="text-center px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-border-divider hover:bg-warm-white transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-bg-card-image overflow-hidden flex-shrink-0">
                          <img
                            src={product.imageUrl1 || getProductImage(product.id)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getCategoryImage(product.category);
                            }}
                          />
                        </div>
                        <span className="text-text-primary font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{product.brand}</td>
                    <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-text-price">
                      &#8377;{formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.stockQuantity === 0 ? (
                        <span className="text-red-accent flex items-center justify-end gap-1">
                          <AlertTriangle size={13} />0
                        </span>
                      ) : product.stockQuantity < 20 ? (
                        <span className="text-yellow-600">{product.stockQuantity}</span>
                      ) : (
                        <span className="text-text-primary">{product.stockQuantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-detail-verified hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 text-red-accent hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Add / Edit form */
const ProductForm = ({ mode, initialData, onSuccess, onCancel }) => {
  /* Parse existing attributes JSON */
  const initAttrs = (() => {
    if (!initialData?.attributes) return {};
    try { return JSON.parse(initialData.attributes); } catch { return {}; }
  })();

  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name || '',
          brand: initialData.brand || '',
          description: initialData.description || '',
          price: initialData.price?.toString() || '',
          mrp: initialData.mrp?.toString() || '',
          category: initialData.category || '',
          stockQuantity: initialData.stockQuantity?.toString() || '',
          releaseDate: initialData.releaseDate || '',
          productAvailable: initialData.productAvailable ?? true,
          imageUrl1: initialData.imageUrl1 || '',
          imageUrl2: initialData.imageUrl2 || '',
          imageUrl3: initialData.imageUrl3 || '',
          imageUrl4: initialData.imageUrl4 || '',
          imageUrl5: initialData.imageUrl5 || '',
        }
      : { ...emptyProduct, mrp: '', imageUrl1: '', imageUrl2: '', imageUrl3: '', imageUrl4: '', imageUrl5: '' }
  );

  const [attrs, setAttrs] = useState(initAttrs);
  const [slotModes, setSlotModes] = useState([
    initialData?.imageUrl1?.startsWith('data:') ? 'file' : 'url',
    initialData?.imageUrl2?.startsWith('data:') ? 'file' : 'url',
    initialData?.imageUrl3?.startsWith('data:') ? 'file' : 'url',
    initialData?.imageUrl4?.startsWith('data:') ? 'file' : 'url',
    initialData?.imageUrl5?.startsWith('data:') ? 'file' : 'url',
  ]);
  const [submitting, setSubmitting] = useState(false);

  /* Dynamic fields based on selected category */
  const categoryFields = getFieldsForCategory(form.category);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAttrChange = (key, value) => {
    setAttrs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSlotModeToggle = (idx, newMode) => {
    setSlotModes((prev) => prev.map((m, i) => (i === idx ? newMode : m)));
    const key = `imageUrl${idx + 1}`;
    setForm((prev) => ({ ...prev, [key]: '' }));
  };

  const handleFileChange = (idx, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const key = `imageUrl${idx + 1}`;
      setForm((prev) => ({ ...prev, [key]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price || !form.category) {
      toast.error('Please fill required fields: name, brand, price, category');
      return;
    }

    setSubmitting(true);

    const product = {
      ...form,
      price: parseFloat(form.price),
      mrp: form.mrp ? parseFloat(form.mrp) : null,
      stockQuantity: parseInt(form.stockQuantity) || 0,
      imageUrl1: form.imageUrl1 || null,
      imageUrl2: form.imageUrl2 || null,
      imageUrl3: form.imageUrl3 || null,
      imageUrl4: form.imageUrl4 || null,
      imageUrl5: form.imageUrl5 || null,
      attributes: JSON.stringify(attrs),
    };

    const formData = new FormData();
    formData.append(
      'product',
      new Blob([JSON.stringify(product)], { type: 'application/json' })
    );

    try {
      if (mode === 'edit' && initialData) {
        await updateProduct(initialData.id, formData);
        toast.success('Product updated');
      } else {
        await addProduct(formData);
        toast.success('Product added');
      }
      onSuccess();
    } catch {
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} product`);
    } finally {
      setSubmitting(false);
    }
  };

  const IMAGE_SLOTS = [1, 2, 3, 4, 5];
  const inputCls = 'w-full px-3 py-2.5 text-sm border border-border-input rounded-lg focus:outline-none focus:border-text-primary';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
        </h1>
        {onCancel && (
          <button onClick={onCancel} className="p-2 hover:bg-warm-beige rounded-lg transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl border border-border-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} className={inputCls} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-text-muted mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Shoppers Price *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">MRP (Maximum Retail Price)</label>
              <input name="mrp" type="number" step="0.01" value={form.mrp} onChange={handleChange} className={inputCls} placeholder="Original price before discount" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={`${inputCls} bg-white`} required>
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Stock Quantity</label>
              <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Release Date</label>
              <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <input name="productAvailable" type="checkbox" checked={form.productAvailable} onChange={handleChange} className="w-4 h-4 accent-red-accent" />
              <label className="text-sm text-text-primary">Available for sale</label>
            </div>
          </div>
        </div>

        {/* ── Category-Specific Attributes ── */}
        {form.category && categoryFields.length > 0 && (
          <div className="bg-white rounded-xl border border-border-card p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              {form.category} Specifications
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Fill in category-specific details for better product listing
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-text-muted mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={attrs[field.key] || ''}
                      onChange={(e) => handleAttrChange(field.key, e.target.value)}
                      className={`${inputCls} bg-white`}
                    >
                      <option value="">Select</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={attrs[field.key] || ''}
                      onChange={(e) => handleAttrChange(field.key, e.target.value)}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5 Image Slots ── */}
        <div className="bg-white rounded-xl border border-border-card p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <ImageIcon size={16} /> Product Images (up to 5)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {IMAGE_SLOTS.map((slot) => {
              const idx = slot - 1;
              const key = `imageUrl${slot}`;
              const value = form[key];
              const slotMode = slotModes[idx];

              return (
                <div key={slot} className="border border-border-card rounded-xl p-3 bg-warm-white">
                  <p className="text-xs font-semibold text-text-muted mb-2">
                    Image {slot} {slot === 1 && '(Primary)'}
                  </p>

                  <div className="flex rounded-lg overflow-hidden border border-border-input mb-2">
                    <button
                      type="button"
                      onClick={() => handleSlotModeToggle(idx, 'file')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                        slotMode === 'file'
                          ? 'bg-btn-primary-bg text-btn-primary-text'
                          : 'bg-white text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <Upload size={12} /> Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSlotModeToggle(idx, 'url')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                        slotMode === 'url'
                          ? 'bg-btn-primary-bg text-btn-primary-text'
                          : 'bg-white text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <LinkIcon size={12} /> URL
                    </button>
                  </div>

                  {slotMode === 'file' ? (
                    <label className="block">
                      <div className="flex items-center gap-1.5 px-2 py-2 text-[11px] border border-border-input rounded-lg cursor-pointer hover:bg-warm-beige transition-colors text-text-secondary truncate">
                        <Upload size={13} />
                        {value ? 'Change file' : 'Choose file'}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(idx, e.target.files?.[0])} className="hidden" />
                    </label>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-2 py-2 text-[11px] border border-border-input rounded-lg focus:outline-none focus:border-text-primary"
                    />
                  )}

                  <div className="mt-2 aspect-square rounded-lg bg-bg-card-image overflow-hidden flex items-center justify-center">
                    {value ? (
                      <img
                        src={value}
                        alt={`Slot ${slot}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.placeholder')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`placeholder flex flex-col items-center gap-1 text-text-muted ${value ? 'hidden' : ''}`}>
                      <ImageIcon size={20} strokeWidth={1.5} />
                      <span className="text-[10px]">No image</span>
                    </div>
                  </div>

                  {value && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, [key]: '' }))}
                      className="mt-1.5 w-full text-[10px] text-red-accent hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-btn-primary-bg text-btn-primary-text rounded-lg text-sm font-semibold hover:bg-black transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Add Product'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

/* ── Admin Orders Manager ── */
const ORDER_STATUSES = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_BADGE = {
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-yellow-50 text-yellow-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/orders');
      setOrders(data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axiosInstance.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
      toast.success(`Order #${orderId} → ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === 'ALL' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-text-primary">Orders ({orders.length})</h1>
        <div className="flex items-center gap-2">
          {['ALL', ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filterStatus === s
                  ? 'bg-btn-primary-bg text-btn-primary-text'
                  : 'bg-white border border-border-input text-text-secondary hover:border-text-primary'
              }`}
            >
              {s === 'ALL' ? `All (${orders.length})` : `${s} (${orders.filter((o) => o.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-warm-beige">
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Order ID</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Items</th>
                <th className="text-right px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Total</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Payment</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Date</th>
                <th className="text-center px-4 py-3 text-xs text-text-muted uppercase tracking-wide font-semibold">Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-text-muted">Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-text-muted">No orders found</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="border-t border-border-divider hover:bg-warm-white transition-colors">
                    <td className="px-4 py-3 font-mono text-text-primary font-medium">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-text-primary text-xs font-medium">{order.deliveryName}</div>
                      <div className="text-text-muted text-[11px]">{order.deliveryEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {order.items?.map((it) => (
                        <div key={it.productId} className="truncate max-w-[180px]">
                          {it.productName} × {it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-price">
                      &#8377;{order.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-text-secondary">{order.paymentMethod}</span>
                      <div className="text-[11px] text-text-muted">{order.paymentStatus}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[order.status] || 'bg-gray-50 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id || order.status === 'CANCELLED' || order.status === 'DELIVERED'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs border border-border-input rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-text-primary disabled:opacity-40"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
