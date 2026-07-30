import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, PaymentMethod, Customer } from '../types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  UserPlus,
  CheckCircle2,
  CreditCard,
  QrCode,
  DollarSign,
  Receipt,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

export const POSView: React.FC = () => {
  const {
    products,
    cartItems,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartDiscount,
    setCartDiscount,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    addCustomer,
    addSale,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.total, 0);
  }, [cartItems]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - cartDiscount);
  }, [subtotal, cartDiscount]);

  // Submit Sale / Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    addSale({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : 'N/A',
      items: cartItems,
      subtotal,
      discount: cartDiscount,
      tax: 0,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Udhar / Credit' ? 'Pending' : 'Paid',
      cashierId: currentUser.id,
      cashierName: currentUser.name,
    });
  };

  // Create new customer quick handler
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const created = addCustomer({
      name: newCustName,
      phone: newCustPhone,
      address: newCustAddress || 'Dhanola, Faisalabad',
      balanceDue: 0,
      notes: 'Added from POS checkout',
    });

    setSelectedCustomer(created);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setShowAddCustomerModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left Column: Product Selection Grid (8 Cols) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search accessories by name, brand, SKU or barcode scan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-mono text-cyan-400 shrink-0">
              <Zap className="w-3.5 h-3.5" />
              <span>Barcode Scanner Ready</span>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((product) => {
            const inStock = product.stock > 0;
            const inCart = cartItems.find((i) => i.productId === product.id);

            return (
              <div
                key={product.id}
                onClick={() => inStock && addToCart(product)}
                className={`group relative bg-slate-900/80 border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden ${
                  !inStock
                    ? 'opacity-50 border-slate-800/60 cursor-not-allowed'
                    : inCart
                    ? 'border-cyan-500/80 bg-slate-900/90 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  {/* Image & Stock Badge */}
                  <div className="relative aspect-square rounded-xl bg-slate-800 overflow-hidden mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-1.5 right-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md ${
                        product.stock <= 0
                          ? 'bg-rose-500/80 text-white'
                          : product.stock <= product.reorderLevel
                          ? 'bg-amber-500/80 text-slate-950 font-extrabold'
                          : 'bg-slate-900/80 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {product.stock <= 0 ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>

                    {inCart && (
                      <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-cyan-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                          {inCart.qty} in Cart
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-100 line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-[9px] text-amber-400 font-medium font-serif mt-0.5">
                    Returned from something (خریدی ہوئی چیز کی واپسی نہیں)
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    PKR {product.sellingPrice.toLocaleString()}
                  </span>
                  <button
                    disabled={!inStock}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Order Cart & Billing (4-5 Cols) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between min-h-[580px] sticky top-20">
          <div className="space-y-4">
            {/* Header & Cart Clear */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Current POS Order</h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Customer Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Customer</span>
                <button
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <UserPlus className="w-3.5 h-3.5" /> + New Client
                </button>
              </div>

              <select
                value={selectedCustomer ? selectedCustomer.id : ''}
                onChange={(e) => {
                  const cust = customers.find((c) => c.id === e.target.value);
                  setSelectedCustomer(cust || null);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">Walk-in Customer (General Counter)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) {c.balanceDue > 0 ? `[Udhar: PKR ${c.balanceDue}]` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Items List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="text-xs">Cart is empty. Select products on left to generate bill.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-slate-100 truncate">{item.name}</h5>
                      <span className="font-mono text-[11px] text-slate-400">
                        PKR {item.unitPrice} x {item.qty}
                      </span>
                      <p className="text-[9px] text-amber-400 font-serif font-medium truncate">Returned from something (خریدی ہوئی چیز کی واپسی نہیں)</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
                        <button
                          onClick={() => updateCartQty(item.productId, item.qty - 1)}
                          className="p-1 hover:text-cyan-400 text-slate-400 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold font-mono text-white text-xs">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.qty + 1)}
                          className="p-1 hover:text-cyan-400 text-slate-400 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-emerald-400 text-xs w-16 text-right">
                        PKR {item.total}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment & Summary Footer */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Cash', 'EasyPaisa', 'JazzCash', 'HBL Konnect', 'Bank Transfer', 'Udhar / Credit'] as PaymentMethod[]).map(
                  (pm) => (
                    <button
                      key={pm}
                      onClick={() => setPaymentMethod(pm)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                        paymentMethod === pm
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {pm}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Discount input */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Discount (PKR):</span>
              <input
                type="number"
                min="0"
                value={cartDiscount || ''}
                onChange={(e) => setCartDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-right text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Totals */}
            <div className="bg-slate-800/80 p-3 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">PKR {subtotal.toLocaleString()}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-xs text-rose-400">
                  <span>Discount Off</span>
                  <span className="font-mono">- PKR {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-700">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-400">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Print & Checkout Button */}
            <button
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                cartItems.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>Checkout & Generate Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Register New Customer</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mian Shahzad Ahmad"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Village</label>
                <input
                  type="text"
                  placeholder="e.g. Chak 117 JB Dhanola, Faisalabad"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
