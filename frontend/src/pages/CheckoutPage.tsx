import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { location } = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [deliveryAddress, setDeliveryAddress] = useState(
    location.placeName || 'Flat 402, Green Glen Layout, Bellandur, Bangalore'
  );
  const [instructions, setInstructions] = useState('Leave with security if not answering.');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'RAZORPAY_TEST'>('CASH_ON_DELIVERY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-charcoal-300 mx-auto" />
        <h2 className="font-display font-bold text-xl text-charcoal-800">
          Your basket is empty
        </h2>
        <p className="text-xs text-charcoal-400">
          Please add dishes from a restaurant before checking out.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    if (!cart.restaurantId) {
      setError('Missing restaurant context in cart.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const createdOrder = await orderService.createOrder({
        restaurantId: cart.restaurantId,
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: instructions.trim() || undefined,
        paymentMethod,
      });

      // Clear local cart
      await clearCart();

      // Navigate to order tracking view
      navigate(`/orders/${createdOrder.id}/tracking`);
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setError(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-cream-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-cravelle-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-charcoal-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cravelle-500" />
              <span>1. Delivery Destination</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Complete Delivery Address
              </label>
              <textarea
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                placeholder="Door/Flat number, building, campus hall, street name..."
                className="w-full px-4 py-2.5 rounded-2xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Ring bell twice, leave with security, call upon arriving at main gate"
                className="w-full px-4 py-2.5 rounded-2xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-charcoal-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cravelle-500" />
              <span>2. Payment Option</span>
            </h2>

            <div className="space-y-3">
              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-cravelle-500 bg-cream-50/70 shadow-xs'
                    : 'border-charcoal-100 hover:border-charcoal-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-charcoal-800">
                      Cash on Delivery (COD)
                    </span>
                    <span className="block text-xs text-charcoal-400">
                      Pay via cash or UPI to the delivery rider upon arrival
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="w-4 h-4 text-cravelle-500"
                />
              </label>

              <label 
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY_TEST'
                    ? 'border-cravelle-500 bg-cream-50/70 shadow-xs'
                    : 'border-charcoal-100 hover:border-charcoal-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-charcoal-800">
                      Online Payment (Razorpay Test Mode)
                    </span>
                    <span className="block text-xs text-charcoal-400">
                      Simulated secure instant digital payment
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'RAZORPAY_TEST'}
                  onChange={() => setPaymentMethod('RAZORPAY_TEST')}
                  className="w-4 h-4 text-cravelle-500"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Bill Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-charcoal-100 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-lg text-charcoal-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cravelle-500" />
              <span>Order Summary</span>
            </h2>

            <div className="text-xs text-charcoal-500 font-semibold pb-2 border-b border-charcoal-100">
              Kitchen: <span className="text-charcoal-800">{cart.restaurantName}</span>
            </div>

            {/* Items snippet */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto">
              {cart.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    {it.isVegetarian ? (
                      <span className="badge-veg shrink-0"></span>
                    ) : (
                      <span className="badge-nonveg shrink-0"></span>
                    )}
                    <span className="truncate text-charcoal-800 font-medium">
                      {it.dishName} x {it.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-charcoal-900 shrink-0">
                    ₹{it.lineTotal.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="pt-3 border-t border-charcoal-100 space-y-1.5 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {cart.deliveryFee === 0 ? (
                    <strong className="text-green-600 font-bold">FREE</strong>
                  ) : (
                    `₹${cart.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Govt Taxes & GST (5%)</span>
                <span>₹{cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-charcoal-200 text-base font-bold text-charcoal-900">
                <span>Total Amount</span>
                <span className="text-cravelle-600">₹{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 rounded-2xl btn-primary font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <span>Place Order • ₹{cart.total.toFixed(0)}</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Safe & Contactless Delivery Guaranteed</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
