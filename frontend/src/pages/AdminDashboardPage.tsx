import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Package, Users, ShoppingBag, AlertTriangle,
  Plus, Edit, Trash2, CheckCircle, RefreshCw, X, Shield, Mail, Loader2
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { DashboardStats, Product, Category, Order } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'subscribers'>('overview');
  const [loading, setLoading] = useState(true);

  // Product Add/Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    imageUrl: '',
    categoryId: 1,
    status: 'ACTIVE',
    size: 'M',
    color: 'Noir',
    stock: 20,
  });
  const [savingProduct, setSavingProduct] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashStats, prodsPage, ordersPage, cats, subs] = await Promise.all([
        adminService.getDashboard(),
        productService.getProducts({ size: 50 }),
        adminService.getAllOrders(0, 20),
        categoryService.getCategories(),
        adminService.getSubscribers(),
      ]);

      setStats(dashStats);
      setProducts(prodsPage.content);
      setOrders(ordersPage.content);
      setCategories(cats);
      setSubscribers(subs);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 2499,
      originalPrice: 2999,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      categoryId: categories[0]?.id || 1,
      status: 'ACTIVE',
      size: 'S',
      color: 'Ivory',
      stock: 25,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      imageUrl: prod.imageUrl,
      categoryId: prod.categoryId,
      status: prod.status,
      size: prod.variants[0]?.size || 'M',
      color: prod.variants[0]?.color || 'Default',
      stock: prod.variants[0]?.stock || 20,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProduct(true);
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        imageUrl: productForm.imageUrl,
        categoryId: Number(productForm.categoryId),
        status: productForm.status,
        variants: [
          { size: productForm.size, color: productForm.color, stock: Number(productForm.stock) }
        ],
        images: [productForm.imageUrl],
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        await adminService.createProduct(payload);
      }

      setProductModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this piece from the catalog?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-taupe-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-gold-600" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Atelier Concierge Administration</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800 mt-1">Cravelle Studio Console</h1>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-2 bg-cream-50 p-1 rounded-lg border border-taupe-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'overview' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'products' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'orders' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'subscribers' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Gazette ({subscribers.length})
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-2">
              <span className="text-xs uppercase tracking-wider text-taupe-400 font-semibold">Verified Sales</span>
              <p className="font-editorial text-2xl sm:text-3xl text-charcoal-800 font-medium">
                ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toLocaleString('en-IN') : '0'}
              </p>
              <div className="flex items-center text-[11px] text-emerald-700 space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Authorized transactions</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-2">
              <span className="text-xs uppercase tracking-wider text-taupe-400 font-semibold">Total Orders</span>
              <p className="font-editorial text-2xl sm:text-3xl text-charcoal-800 font-medium">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-[11px] text-taupe-400">{stats?.pendingOrders || 0} in active processing</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-2">
              <span className="text-xs uppercase tracking-wider text-taupe-400 font-semibold">Catalog Items</span>
              <p className="font-editorial text-2xl sm:text-3xl text-charcoal-800 font-medium">
                {stats?.totalProducts || 0}
              </p>
              <p className="text-[11px] text-taupe-400">Across {categories.length} curated categories</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-2">
              <span className="text-xs uppercase tracking-wider text-taupe-400 font-semibold">Registered Clients</span>
              <p className="font-editorial text-2xl sm:text-3xl text-charcoal-800 font-medium">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-[11px] text-taupe-400">{stats?.activeSubscribers || 0} Gazette subscribers</p>
            </div>
          </div>

          {/* Recent Orders in Overview */}
          <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-4">
            <h3 className="font-editorial text-lg text-charcoal-800">Recent Customer Orders</h3>
            <div className="divide-y divide-taupe-100 text-xs">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-charcoal-800">#CRV-{ord.id.toString().padStart(5, '0')}</span>
                    <span className="text-taupe-400 ml-2">&bull; {ord.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-charcoal-800">₹{ord.total.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 bg-cream-200 text-charcoal-700 rounded font-semibold text-[10px]">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-editorial text-2xl text-charcoal-800">Atelier Catalog Pieces</h2>
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2 btn-gold text-xs font-semibold uppercase tracking-wider rounded inline-flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Silhouette</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-taupe-200 overflow-x-auto shadow-soft">
            <table className="w-full text-left text-xs text-charcoal-700 divide-y divide-taupe-200">
              <thead className="bg-cream-50 uppercase tracking-wider text-[10px] text-taupe-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Piece</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Variants / Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-14 object-cover rounded bg-cream-100 shrink-0" />
                      <div>
                        <p className="font-editorial text-sm text-charcoal-800 font-medium">{p.name}</p>
                        <p className="text-[10px] text-taupe-400">/{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{p.categoryName}</td>
                    <td className="py-3 px-4 font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-taupe-200 text-charcoal-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-500">
                      {p.variants?.map((v) => `${v.size} (${v.stock})`).join(', ') || 'No variants'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-1 text-charcoal-600 hover:text-gold-600"
                        title="Edit piece"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-taupe-400 hover:text-red-600"
                        title="Delete piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="font-editorial text-2xl text-charcoal-800">Order Fulfillment Management</h2>
          <div className="bg-white rounded-lg border border-taupe-200 overflow-x-auto shadow-soft">
            <table className="w-full text-left text-xs text-charcoal-700 divide-y divide-taupe-200">
              <thead className="bg-cream-50 uppercase tracking-wider text-[10px] text-taupe-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Pieces</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50/50">
                    <td className="py-3 px-4 font-editorial font-semibold">#CRV-{ord.id.toString().padStart(5, '0')}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-charcoal-800">{ord.customerName}</p>
                      <p className="text-[10px] text-taupe-400">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4">{ord.items.length} piece(s)</td>
                    <td className="py-3 px-4 font-semibold">₹{ord.total.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-cream-200 text-charcoal-700'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-cream-50 border border-taupe-300 rounded px-2.5 py-1 text-xs text-charcoal-800 font-medium focus:outline-none focus:border-gold-500"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gazette Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <h2 className="font-editorial text-2xl text-charcoal-800">Gazette Newsletter Clients</h2>
          <div className="bg-white rounded-lg border border-taupe-200 p-6 space-y-3 shadow-soft max-w-xl">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase text-gold-600">
              <Mail className="w-4 h-4" />
              <span>Active Subscriptions ({subscribers.length})</span>
            </div>
            <div className="divide-y divide-taupe-100 text-xs">
              {subscribers.map((sub: any, i: number) => (
                <div key={i} className="py-2.5 flex justify-between">
                  <span className="font-medium text-charcoal-800">{sub.email}</span>
                  <span className="text-[11px] text-taupe-400">
                    {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-taupe-200">
              <h3 className="font-editorial text-xl text-charcoal-800">
                {editingProduct ? 'Edit Atelier Piece' : 'Add New Atelier Piece'}
              </h3>
              <button type="button" onClick={() => setProductModalOpen(false)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal-700 block mb-1">Piece Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Aurelia Silk Slip Dress"
                  className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 block mb-1">Category</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                  className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-charcoal-700 block mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 block mb-1">Imagery URL</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal-700 block mb-1">Atelier Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Handcrafted from mulberry silk..."
                  className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-3 bg-cream-50 rounded border border-taupe-200">
                <div>
                  <label className="font-medium text-charcoal-700 block mb-1">Primary Size</label>
                  <input
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    className="w-full bg-white border border-taupe-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-charcoal-700 block mb-1">Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full bg-white border border-taupe-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-charcoal-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-white border border-taupe-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 btn-gold text-xs font-semibold uppercase rounded"
                >
                  {savingProduct ? 'Saving Piece...' : 'Save Silhouette'}
                </button>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 border rounded text-charcoal-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
