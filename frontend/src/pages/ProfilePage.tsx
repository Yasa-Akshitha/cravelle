import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { authService } from '../services/authService';
import { Order, Address } from '../types';
import { User, Package, MapPin, KeyRound, Edit3, X, Check, AlertCircle, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'security'>('orders');
  const [loading, setLoading] = useState(true);

  // Edit Name
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [updatingName, setUpdatingName] = useState(false);

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, addressesData] = await Promise.all([
          orderService.getUserOrders(),
          addressService.getAddresses(),
        ]);
        setOrders(ordersData);
        setAddresses(addressesData);
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setUpdatingName(true);
      const updated = await authService.updateProfile(newName.trim());
      updateUser(updated);
      setEditNameOpen(false);
    } catch {
      // ignore
    } finally {
      setUpdatingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setChangingPass(true);
      setPasswordMsg(null);
      await authService.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Error changing password' });
    } finally {
      setChangingPass(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you wish to cancel this order? Available stock will be restored.')) return;
    try {
      setCancellingOrderId(orderId);
      const cancelled = await orderService.cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? cancelled : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(cancelled);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-taupe-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#1C1B1A] text-gold-400 font-editorial text-2xl flex items-center justify-center font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-editorial text-2xl text-charcoal-800">{user?.name}</h1>
              <button
                type="button"
                onClick={() => setEditNameOpen(true)}
                className="text-taupe-400 hover:text-gold-600 p-1"
                title="Edit Name"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-taupe-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold bg-cream-200 text-charcoal-700 px-2 py-0.5 rounded">
              {user?.role} CLIENT
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border border-taupe-200 rounded p-1 bg-cream-50 text-xs font-semibold">
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
            onClick={() => setActiveTab('addresses')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'addresses' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Addresses ({addresses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'security' ? 'bg-[#1C1B1A] text-white' : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-editorial text-xl text-charcoal-800">Your Order History</h2>

          {loading ? (
            <div className="p-8 text-center text-xs text-taupe-400">Loading order records...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-lg border border-taupe-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-editorial font-semibold text-base text-charcoal-800">
                        #CRV-{order.id.toString().padStart(5, '0')}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gold-100 text-gold-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-taupe-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {order.items.length} piece(s)
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-base font-semibold text-charcoal-800">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 border border-charcoal-700 hover:bg-cream-100 text-charcoal-700 text-xs font-semibold rounded"
                      >
                        View Details
                      </button>
                      {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'SHIPPED' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold rounded"
                        >
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-lg border border-taupe-200 text-center text-xs text-taupe-400">
              You have placed no orders yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <h2 className="font-editorial text-xl text-charcoal-800">Saved Shipping Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-5 bg-white rounded-lg border border-taupe-200 shadow-soft space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-charcoal-800">{addr.recipientName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-gold-100 text-gold-700 font-bold px-2 py-0.5 rounded uppercase">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-600">{addr.addressLine}</p>
                <p className="text-xs text-charcoal-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                <p className="text-[11px] text-taupe-400">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft max-w-md space-y-4">
          <h2 className="font-editorial text-xl text-charcoal-800">Update Password</h2>
          {passwordMsg && (
            <div className={`p-3 text-xs rounded border ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {passwordMsg.text}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-charcoal-700 block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="font-medium text-charcoal-700 block mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
              />
            </div>
            <button
              type="submit"
              disabled={changingPass}
              className="px-5 py-2.5 btn-gold text-xs font-semibold uppercase rounded"
            >
              {changingPass ? 'Updating...' : 'Save New Password'}
            </button>
          </form>
        </div>
      )}

      {/* Edit Name Modal */}
      {editNameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full space-y-4">
            <h3 className="font-editorial text-lg text-charcoal-800">Edit Name</h3>
            <form onSubmit={handleUpdateName} className="space-y-4 text-xs">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2"
              />
              <div className="flex space-x-2">
                <button type="submit" disabled={updatingName} className="px-4 py-2 btn-gold text-xs font-semibold rounded">
                  Save
                </button>
                <button type="button" onClick={() => setEditNameOpen(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-taupe-200">
              <div>
                <h3 className="font-editorial text-lg text-charcoal-800">
                  Order Details #CRV-{selectedOrder.id.toString().padStart(5, '0')}
                </h3>
                <span className="text-[11px] text-taupe-400">
                  Status: <strong className="text-charcoal-800">{selectedOrder.orderStatus}</strong>
                </span>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-600">Ordered Pieces</h4>
              <div className="divide-y divide-taupe-100">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-editorial font-medium text-charcoal-800">{it.productName}</p>
                      <p className="text-[10px] text-taupe-400">Qty: {it.quantity} &bull; Size: {it.selectedSize} &bull; Color: {it.selectedColor}</p>
                    </div>
                    <span className="font-semibold text-charcoal-800">₹{it.lineTotal.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-taupe-200 flex justify-between text-xs font-semibold">
              <span>Total Authorized</span>
              <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 text-xs text-charcoal-600 space-y-1">
              <p className="font-semibold text-charcoal-800">Shipping to:</p>
              <p>{selectedOrder.shippingAddress.recipientName}, {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.postalCode}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-cream-100 text-charcoal-700 text-xs font-semibold rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
