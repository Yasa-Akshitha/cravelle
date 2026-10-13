import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, Plus, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'TEST_CARD'>('CASH_ON_DELIVERY');

  const [newAddress, setNewAddress] = useState<Address>({
    recipientName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: true,
  });

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const list = await addressService.getAddresses();
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.id || null);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      }
    };

    loadAddresses();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addressService.createAddress(newAddress);
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id || null);
      setShowNewAddressForm(false);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error saving shipping address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setErrorMessage('Please select or enter a shipping destination address.');
      return;
    }

    if (cart.items.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    try {
      setSubmittingOrder(true);
      setErrorMessage(null);

      const order = await orderService.createOrder(selectedAddressId, paymentMethod);
      await refreshCart();
      navigate(`/order-success/${order.id}`, { state: { order } });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error placing order. Please try again.';
      setErrorMessage(msg);
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl text-charcoal-800">Your Shopping Bag is Empty</h2>
        <Link to="/shop" className="inline-block px-6 py-2.5 btn-gold text-xs font-semibold uppercase rounded">
          Return to Atelier
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-taupe-200 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Bespoke Checkout</span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800 mt-1">Fulfillment & Payment</h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Shipping Address & Payment Form */}
        <div className="lg:col-span-2 space-y-10">
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-taupe-100">
              <h3 className="font-editorial text-xl text-charcoal-800 flex items-center space-x-2">
                <span>1. Shipping Destination</span>
              </h3>
              {!showNewAddressForm && addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {/* Existing Addresses Cards */}
            {!showNewAddressForm && addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id || null)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-gold-500 bg-cream-50 ring-1 ring-gold-500'
                        : 'border-taupe-200 hover:border-taupe-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-charcoal-800">{addr.recipientName}</span>
                      {selectedAddressId === addr.id && <Check className="w-4 h-4 text-gold-600" />}
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">{addr.addressLine}</p>
                    <p className="text-xs text-charcoal-600">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-[11px] text-taupe-500 mt-2">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-medium text-charcoal-700 block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.recipientName}
                      onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                      className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-charcoal-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-medium text-charcoal-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Suite, apartment, street name"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="font-medium text-charcoal-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-charcoal-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-charcoal-700 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full bg-cream-50 border border-taupe-200 rounded px-3 py-2 text-charcoal-800 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="px-5 py-2 btn-gold text-xs font-semibold uppercase rounded">
                    Save Address
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 border border-taupe-300 text-charcoal-600 text-xs rounded hover:bg-cream-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-6">
            <h3 className="font-editorial text-xl text-charcoal-800 pb-3 border-b border-taupe-100">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-gold-500 bg-cream-50 ring-1 ring-gold-500'
                    : 'border-taupe-200 hover:border-taupe-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Banknote className="w-5 h-5 text-gold-600" />
                  <div>
                    <p className="text-xs font-semibold text-charcoal-800">Cash On Delivery</p>
                    <p className="text-[11px] text-taupe-400">Pay gracefully upon garment arrival</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="text-gold-600"
                />
              </label>

              <label
                className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'TEST_CARD'
                    ? 'border-gold-500 bg-cream-50 ring-1 ring-gold-500'
                    : 'border-taupe-200 hover:border-taupe-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gold-600" />
                  <div>
                    <p className="text-xs font-semibold text-charcoal-800">Test Payment Gateway</p>
                    <p className="text-[11px] text-taupe-400">Verified instant simulated authorization</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'TEST_CARD'}
                  onChange={() => setPaymentMethod('TEST_CARD')}
                  className="text-gold-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Col: Order Review & Place Order Button */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-4">
            <h3 className="font-editorial text-lg text-charcoal-800 pb-2 border-b border-taupe-100">
              Bag Summary
            </h3>

            {/* Compact Items List */}
            <div className="divide-y divide-taupe-100 max-h-56 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.productImageUrl} alt={item.productName} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <p className="font-editorial font-medium text-charcoal-800 line-clamp-1">{item.productName}</p>
                      <p className="text-[10px] text-taupe-400">Qty: {item.quantity} &bull; {item.size}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-charcoal-800">₹{item.lineTotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-taupe-200 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Express Courier Shipping</span>
                <span>{cart.shippingFee === 0 ? 'Complimentary' : `₹${cart.shippingFee.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="pt-2 border-t border-taupe-200 flex justify-between text-base font-semibold text-charcoal-900">
                <span>Final Total</span>
                <span>₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA with Duplicate Submission Guard */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={submittingOrder}
              className="w-full py-4 btn-gold text-xs font-semibold uppercase tracking-widest rounded shadow-xl disabled:opacity-50 inline-flex items-center justify-center space-x-2"
            >
              {submittingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authorizing Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-cream-50 rounded border border-taupe-200 space-y-2 text-[11px] text-taupe-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Encrypted server-side checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-gold-600" />
              <span>Complimentary insured shipping nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
