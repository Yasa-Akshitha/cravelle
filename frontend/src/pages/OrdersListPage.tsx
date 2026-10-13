import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, MapPin, Bike, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

export const OrdersListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    orderService
      .getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-cream-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      
      <div>
        <h1 className="font-display font-bold text-3xl text-charcoal-900">
          My Food Orders
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-400 mt-1">
          Review previous food orders, track active deliveries, and inspect itemized receipts.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-charcoal-100 animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-charcoal-100 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-charcoal-800">
            No orders found yet
          </h3>
          <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
            Discover great dining options near your college, office, or saved places and order today.
          </p>
          <Link to="/explore" className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold inline-block">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-charcoal-100 hover:border-cravelle-200 shadow-sm hover:shadow-card transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-base text-charcoal-800">
                    {order.restaurantName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-100 text-cravelle-700 border border-cravelle-200">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-charcoal-500 line-clamp-1">
                  {order.items?.map((it) => `${it.dishName} x${it.quantity}`).join(', ')}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-charcoal-400">
                  <span className="font-bold text-charcoal-900 text-xs">
                    ₹{order.totalAmount.toFixed(0)}
                  </span>
                  <span>•</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>ID: {order.orderNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/orders/${order.id}/tracking`}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Bike className="w-4 h-4" />
                  <span>Live Tracking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
