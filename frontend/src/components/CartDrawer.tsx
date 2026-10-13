import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-charcoal-100 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cravelle-500 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-charcoal-800">
                  Your Food Cart
                </h2>
                {cart.restaurantName ? (
                  <p className="text-xs text-cravelle-600 font-semibold truncate max-w-[220px]">
                    from {cart.restaurantName}
                  </p>
                ) : (
                  <p className="text-xs text-charcoal-400">0 items</p>
                )}
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-cream-200 text-charcoal-400 hover:text-charcoal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-cream-100 text-cravelle-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-base text-charcoal-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-charcoal-400 mt-1 max-w-xs mx-auto">
                  Explore top restaurants near your campus, workplace, or current location to add freshly prepared dishes.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-charcoal-100 text-xs text-charcoal-400">
                  <span>{cart.items.length} item(s) in basket</span>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-charcoal-100 bg-white shadow-xs gap-3"
                    >
                      {/* Left Veg Dot & Name */}
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {item.isVegetarian ? (
                          <span className="badge-veg shrink-0 mt-1" title="Pure Veg"></span>
                        ) : (
                          <span className="badge-nonveg shrink-0 mt-1" title="Non Veg"></span>
                        )}
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-charcoal-800 truncate">
                            {item.dishName}
                          </h4>
                          <span className="text-xs font-semibold text-charcoal-600">
                            ₹{item.unitPrice} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-charcoal-50 border border-charcoal-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-0.5 text-charcoal-600 hover:text-cravelle-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-0.5 text-charcoal-600 hover:text-cravelle-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total & remove */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-charcoal-900 block">
                          ₹{item.lineTotal.toFixed(0)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Free Delivery encouragement */}
                {cart.subtotal < 500 && (
                  <div className="p-3 rounded-2xl bg-cream-100 border border-cravelle-200/80 text-xs text-charcoal-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cravelle-500 shrink-0" />
                    <span>
                      Add <strong>₹{(500 - cart.subtotal).toFixed(0)}</strong> more for <strong>Free Delivery</strong>!
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bill Details */}
          {cart.items.length > 0 && (
            <div className="p-6 border-t border-charcoal-100 bg-cream-50 space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-charcoal-800">₹{cart.subtotal.toFixed(2)}</span>
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
                  <span>Govt Taxes & Restaurant GST (5%)</span>
                  <span>₹{cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-charcoal-200 text-sm font-bold text-charcoal-900">
                  <span>To Pay</span>
                  <span className="text-base text-cravelle-600">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl btn-primary font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-400">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>Verified prices & server-calculated bill</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
