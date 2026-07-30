import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, CategoryType } from '../types';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit2,
  Trash2,
  SlidersHorizontal,
  X,
  TrendingUp,
  MapPin,
  Barcode,
  CheckCircle,
  Upload,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    hasRole,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lowStock' | 'outOfStock'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Restock / Supplier Delivery');

  // New Product Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    barcode: `89012345${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    brand: 'Ronin',
    category: 'Chargers & Adapters',
    costPrice: 500,
    sellingPrice: 750,
    stock: 10,
    reorderLevel: 5,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
    description: '',
    locationInShop: 'Main Display Shelf',
  });

  const categoriesList: CategoryType[] = [
    'Smartphones & Mobiles',
    'AirPods & Wireless Earbuds',
    'Handsfree & Wired Headsets',
    'Chargers & Adapters',
    'Power Banks',
    'Earbuds & Audio',
    'Mobile Covers',
    'Screen Protectors',
    'Networking & Routers',
    'Holders & Lights',
    'SIM & EasyLoad',
    'Repair Parts',
    'General Accessories',
  ];

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      if (!matchesSearch || !matchesCat) return false;

      if (filterType === 'lowStock') return p.stock <= p.reorderLevel && p.stock > 0;
      if (filterType === 'outOfStock') return p.stock <= 0;
      return true;
    });
  }, [products, searchTerm, filterType, selectedCategory]);

  // Handle Save New or Edit
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      addProduct(formData);
    }

    setShowAddModal(false);
  };

  // Open Edit Modal
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      barcode: product.barcode || '',
      name: product.name,
      brand: product.brand,
      category: product.category,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      image: product.image,
      description: product.description,
      locationInShop: product.locationInShop || '',
    });
    setShowAddModal(true);
  };

  // Handle Stock Adjustment
  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || adjustQty === 0) return;
    adjustStock(adjustingProduct.id, adjustQty, adjustReason);
    setAdjustingProduct(null);
    setAdjustQty(0);
  };

  // Handle Product Image File Upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Stock & Inventory Management</h2>
          </div>
          <p className="text-xs text-slate-400">
            Track accessories stock counts, low-stock reorder levels, cost prices & shelf locations.
          </p>
        </div>

        {hasRole(['admin', 'manager']) && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
                barcode: `89012345${Math.floor(1000 + Math.random() * 9000)}`,
                name: '',
                brand: 'Ronin',
                category: 'Chargers & Adapters',
                costPrice: 500,
                sellingPrice: 750,
                stock: 10,
                reorderLevel: 5,
                image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
                description: '',
                locationInShop: 'Main Display Shelf',
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Inventory Item
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setFilterType('lowStock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                filterType === 'lowStock'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
            </button>
            <button
              onClick={() => setFilterType('outOfStock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                filterType === 'outOfStock'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-800 text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-4">Item & Brand</th>
                <th className="p-4">SKU / Location</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Selling Price</th>
                {hasRole(['admin']) && <th className="p-4 text-right">Cost Price</th>}
                <th className="p-4 text-center">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.reorderLevel && p.stock > 0;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 text-slate-200 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-100 text-xs">{p.name}</h4>
                          <span className="text-[10px] text-cyan-400 font-semibold">{p.brand}</span>
                          <p className="text-[9px] text-amber-400 font-medium font-serif mt-0.5">Returned from something (خریدی ہوئی چیز کی واپسی نہیں)</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      <div>{p.sku}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {p.locationInShop || 'Display Rack'}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-medium border border-slate-700">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      PKR {(p.sellingPrice ?? 0).toLocaleString()}
                    </td>

                    {hasRole(['admin']) && (
                      <td className="p-4 text-right font-mono text-slate-400">
                        PKR {(p.costPrice ?? 0).toLocaleString()}
                      </td>
                    )}

                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOut
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isLow && <AlertTriangle className="w-3 h-3" />}
                        {p.stock} Units ({isOut ? 'Out' : isLow ? 'Low' : 'OK'})
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingProduct(p);
                            setAdjustQty(0);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 text-[11px] font-medium cursor-pointer"
                        >
                          ± Stock
                        </button>

                        {hasRole(['admin', 'manager']) && (
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {hasRole(['admin']) && (
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ronin, Airox, Interlink"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ronin 25W Fast Charger UA-25"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Shop Rack Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack A2, Counter Glass"
                    value={formData.locationInShop}
                    onChange={(e) => setFormData({ ...formData, locationInShop: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Selling Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Low-Stock Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Real Product Photo from Device</label>
                <div className="relative border border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-3 text-center bg-slate-800/50 transition-all cursor-pointer group mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-xs text-slate-300 font-medium">Click to select photo or drop here</span>
                  </div>
                </div>

                <label className="block text-xs font-semibold text-slate-300 mb-1">Or Paste Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />

                {formData.image && (
                  <div className="mt-2 flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <img src={formData.image} alt="Product Preview" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-700" />
                    <span className="text-[11px] text-emerald-400 font-semibold">Image preview ready</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Quick Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Adjust Stock Count</h3>
              <button
                onClick={() => setAdjustingProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-2xl flex items-center gap-3 text-xs">
              <img
                src={adjustingProduct.image}
                alt={adjustingProduct.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-white">{adjustingProduct.name}</h4>
                <p className="text-slate-400">Current Stock: <span className="font-mono text-cyan-400 font-bold">{adjustingProduct.stock}</span></p>
              </div>
            </div>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Stock Change (+ for restock, - for damage/sale)
                </label>
                <input
                  type="number"
                  required
                  value={adjustQty || ''}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  placeholder="e.g. +10 or -2"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. New delivery from wholesaler"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
