import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      orderService.getOrderById(Number(id))
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
          <CheckCircle className="w-8 h-8 stroke-[1.75]" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold block">Order Confirmed</span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800">
          Thank you for choosing Cravelle
        </h1>
        <p className="text-xs text-taupe-400 max-w-md mx-auto">
          Your order has been recorded in our atelier ledger and will be packaged with signature Cravelle ribbon.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-lg border border-taupe-200 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-taupe-200 text-xs gap-4">
            <div>
              <p className="text-taupe-400 uppercase tracking-wider font-semibold">Order Number</p>
              <p className="font-editorial text-lg text-charcoal-800 font-medium">#CRV-{order.id.toString().padStart(5, '0')}</p>
            </div>
            <div>
              <p className="text-taupe-400 uppercase tracking-wider font-semibold">Fulfillment Status</p>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-cream-200 text-charcoal-800 font-semibold rounded text-[11px]">
                {order.orderStatus}
              </span>
            </div>
            <div>
              <p className="text-taupe-400 uppercase tracking-wider font-semibold">Payment Status</p>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                {order.paymentStatus} ({order.paymentMethod})
              </span>
            </div>
          </div>

          {/* Ordered Pieces */}
          <div className="space-y-3">
            <h3 className="font-editorial text-base text-charcoal-800">Pieces in this Shipment</h3>
            <div className="divide-y divide-taupe-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {item.productImageUrl && (
                      <img src={item.productImageUrl} alt={item.productName} className="w-10 h-14 object-cover rounded bg-cream-100" />
                    )}
                    <div>
                      <p className="font-editorial font-medium text-charcoal-800">{item.productName}</p>
                      <p className="text-[10px] text-taupe-400">
                        Qty: {item.quantity} &bull; Size: {item.selectedSize} &bull; Color: {item.selectedColor}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-charcoal-800">
                    ₹{item.lineTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="pt-4 border-t border-taupe-200 flex flex-col sm:flex-row justify-between text-xs text-charcoal-600 gap-4">
            <div>
              <p className="font-semibold text-charcoal-800 uppercase tracking-wider text-[11px] mb-1">Delivering to:</p>
              <p>{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.addressLine}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p className="text-taupe-400 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
            <div className="sm:text-right space-y-1">
              <p className="font-semibold text-charcoal-800 uppercase tracking-wider text-[11px] mb-1">Total Authorized:</p>
              <p className="text-xl font-editorial font-semibold text-charcoal-900">
                ₹{order.total.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-taupe-400">Includes taxes & shipping</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/profile"
          className="w-full sm:w-auto px-6 py-3 border border-charcoal-700 text-charcoal-700 hover:bg-cream-100 text-xs font-semibold uppercase tracking-wider rounded text-center transition-colors"
        >
          View in Order History
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 btn-gold text-xs font-semibold uppercase tracking-wider rounded text-center inline-flex items-center justify-center space-x-2"
        >
          <span>Continue Browsing</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>
    </div>
  );
};
