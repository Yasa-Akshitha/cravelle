import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PackageCheck, 
  ChefHat, 
  CheckCircle, 
  Bike, 
  MapPin, 
  Clock, 
  Phone, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { OrderTracking, OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await orderService.getTracking(parseInt(id));
      setTracking(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not retrieve order tracking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const handleSimulateStep = async () => {
    if (!id || simulating) return;
    try {
      setSimulating(true);
      const updated = await orderService.simulateNextStep(parseInt(id));
      setTracking(updated);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-4">
        <div className="h-8 w-48 bg-charcoal-100 rounded-xl animate-pulse"></div>
        <div className="h-72 bg-charcoal-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="font-display font-bold text-xl text-charcoal-800">
          Order Tracking Not Available
        </h2>
        <p className="text-xs text-charcoal-400">
          {error || 'Unable to locate order.'}
        </p>
        <Link to="/orders" className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold inline-block">
          View All Orders
        </Link>
      </div>
    );
  }

  const getStepIcon = (status: OrderStatus, completed: boolean, current: boolean) => {
    switch (status) {
      case 'ORDER_PLACED':
        return <PackageCheck className="w-4 h-4" />;
      case 'RESTAURANT_CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'BEING_PREPARED':
        return <ChefHat className="w-4 h-4" />;
      case 'READY_FOR_PICKUP':
        return <PackageCheck className="w-4 h-4" />;
      case 'OUT_FOR_DELIVERY':
        return <Bike className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const isDelivered = tracking.status === 'DELIVERED';

  return (
    <div className="w-full min-h-screen bg-cream-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-cravelle-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>

        <span className="text-xs text-charcoal-400">
          Order ID: <strong className="text-charcoal-800">{tracking.orderNumber}</strong>
        </span>
      </div>

      {/* Main Tracking Status Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cravelle-600">
              Live Food Order Tracking
            </span>
            <h1 className="font-display font-bold text-2xl text-charcoal-900 mt-0.5">
              {isDelivered ? 'Order Delivered Enjoy your meal!' : 'Your food is on the way!'}
            </h1>
            <p className="text-xs text-charcoal-400 mt-1">
              Freshly prepared by <strong>{tracking.restaurantName}</strong>
            </p>
          </div>

          {/* Delivery partner info card */}
          {tracking.riderName && (
            <div className="p-3.5 px-4 rounded-2xl bg-cream-50 border border-cravelle-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cravelle-500 text-white flex items-center justify-center shadow-xs">
                <Bike className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-charcoal-800">
                  {tracking.riderName}
                </span>
                <span className="block text-[11px] text-charcoal-500">
                  {tracking.riderPhone || 'Delivery Partner Assigned'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6-STAGE VISUAL PROGRESSION TIMELINE */}
        <div className="py-4">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-charcoal-100">
            {tracking.steps.map((step, idx) => {
              const isCompleted = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="relative flex items-start gap-4 z-10">
                  
                  {/* Step Circle Indicator */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-cravelle-600 to-coral-400 text-white shadow-md shadow-cravelle-500/40 ring-4 ring-cravelle-100 scale-105'
                        : isCompleted
                        ? 'bg-green-500 text-white shadow-xs'
                        : 'bg-white border-2 border-charcoal-200 text-charcoal-400'
                    }`}
                  >
                    {getStepIcon(step.status, isCompleted, isCurrent)}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-sm font-bold ${isCurrent ? 'text-cravelle-600' : isCompleted ? 'text-charcoal-800' : 'text-charcoal-400'}`}>
                        {step.status.replace(/_/g, ' ')}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[11px] text-charcoal-400 font-mono">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {step.note}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Destination Snippet */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-100 flex items-center gap-3 text-xs text-charcoal-600">
          <MapPin className="w-5 h-5 text-cravelle-500 shrink-0" />
          <div>
            <strong className="text-charcoal-800">Delivering to:</strong> {tracking.deliveryAddress}
          </div>
        </div>

      </div>

      {/* DEMO STATUS ADVANCE SIMULATOR (Clearly labelled as demo per project requirements) */}
      <div className="p-6 rounded-3xl bg-charcoal-900 text-white border border-charcoal-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-cravelle-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Demo Simulation</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-charcoal-800 text-charcoal-300 border border-charcoal-700">
            Developer & Evaluator Tool
          </span>
        </div>

        <p className="text-xs text-charcoal-300 leading-relaxed">
          Cravelle provides a secure simulated status workflow for testing the 6-stage lifecycle without requiring live third-party delivery dispatch credentials.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          {!isDelivered ? (
            <button
              onClick={handleSimulateStep}
              disabled={simulating}
              className="px-6 py-3 rounded-2xl btn-primary font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
              <span>{simulating ? 'Advancing Stage...' : 'Simulate Next Delivery Step (Demo)'}</span>
            </button>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>All 6 Delivery Stages Completed Successfully!</span>
            </div>
          )}

          <button
            onClick={fetchTracking}
            className="px-4 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 text-xs font-bold border border-charcoal-700 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>

    </div>
  );
};
