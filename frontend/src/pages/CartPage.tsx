import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const freeShippingThreshold = 3000;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-editorial text-3xl text-charcoal-800">Your Shopping Bag is Waiting</h2>
        <p className="text-xs text-taupe-400 max-w-md mx-auto">
          Please sign in to access your synchronized cart, saved wishlist pieces, and enjoy personalized couture checkout.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-wider rounded"
        >
          Sign In to Cravelle
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-editorial text-3xl text-charcoal-800">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-taupe-400 max-w-md mx-auto">
          You haven&apos;t added any silhouettes yet. Discover our latest mulberry silks, evening gowns, and tailored outerwear.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-wider rounded"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-taupe-200 pb-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Shopping Bag</span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800 mt-1">Review Your Selection</h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-taupe-400 hover:text-red-600 transition-colors"
        >
          Clear All Pieces
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-cream-100 p-4 rounded-lg border border-taupe-200 space-y-2">
        <div className="flex justify-between text-xs font-medium text-charcoal-700">
          <span className="flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-gold-600" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-semibold">You have unlocked Complimentary Express Shipping!</span>
            ) : (
              <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} more for Complimentary Express Shipping</span>
            )}
          </span>
          <span className="text-charcoal-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-taupe-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gold-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 divide-y divide-taupe-200">
          {cart.items.map((item) => (
            <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Link to={`/product/${item.productSlug || item.productId}`}>
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-20 h-28 object-cover rounded bg-cream-100 shrink-0 border border-taupe-200"
                  />
                </Link>
                <div className="space-y-1">
                  <Link
                    to={`/product/${item.productSlug || item.productId}`}
                    className="font-editorial text-base text-charcoal-800 hover:text-gold-600 font-medium transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-taupe-400">
                    Size: <span className="text-charcoal-700 font-medium">{item.size}</span> &bull; Color: <span className="text-charcoal-700 font-medium">{item.color}</span>
                  </p>
                  <p className="text-xs font-semibold text-charcoal-800">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                <div className="flex items-center border border-taupe-300 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={loading}
                    className="px-2.5 py-1 text-xs text-charcoal-600 hover:bg-cream-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-charcoal-800">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={loading || item.quantity >= item.availableStock}
                    className="px-2.5 py-1 text-xs text-charcoal-600 hover:bg-cream-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-semibold text-charcoal-800 min-w-16 text-right">
                  ₹{item.lineTotal.toLocaleString('en-IN')}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={loading}
                  className="p-1.5 text-taupe-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-taupe-200 shadow-soft space-y-4">
            <h3 className="font-editorial text-lg text-charcoal-800 pb-2 border-b border-taupe-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal ({cart.totalItems} pieces)</span>
                <span className="font-semibold text-charcoal-800">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Estimated Express Shipping</span>
                <span className="font-semibold text-charcoal-800">
                  {cart.shippingFee === 0 ? 'Complimentary' : `₹${cart.shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="pt-3 border-t border-taupe-200 flex justify-between text-base font-semibold text-charcoal-900">
                <span>Estimated Total</span>
                <span>₹{cart.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 btn-gold text-xs font-semibold uppercase tracking-widest rounded shadow-md inline-flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Value Props */}
          <div className="p-4 bg-cream-50 rounded border border-taupe-200 space-y-2 text-[11px] text-taupe-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Verified server-side inventory reservation</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-gold-600" />
              <span>14-day complimentary returns on all pieces</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
