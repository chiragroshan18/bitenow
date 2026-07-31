import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getOrderById, cancelOrder } from '@/services/orderService';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import LiveTrackingMap from '@/components/map/LiveTrackingMap';
import ReviewForm from '@/components/reviews/ReviewForm';
import Button from '@/components/ui/Button';

const STATUS_LABELS = {
  PLACED: 'Order placed',
  ACCEPTED: 'Accepted by restaurant',
  PREPARING: 'Preparing your food',
  READY_FOR_PICKUP: 'Ready for pickup',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

function OrderTracking() {
  const { id } = useParams();
  const [hasReviewed, setHasReviewed] = useState(false);
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });

  const liveUpdate = useOrderTracking(id);
  const currentStatus = liveUpdate?.status || order?.status;

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });

  if (isLoading) return <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">Loading order...</div>;
  if (!order)
    return <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center text-red-500">Order not found.</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Order Tracking</h1>
        <p className="text-white/40 text-sm mb-6">{order.restaurant.name}</p>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-2xl p-4 border border-white/10 mb-6"
        >
          <p className="text-xl font-bold text-orange-400">
            {STATUS_LABELS[currentStatus] || currentStatus}
          </p>
          {liveUpdate && (
            <p className="text-white/40 text-sm mt-1">
              🔄 Live update received
            </p>
          )}
        </motion.div>

        {/* Cancel Button */}
        {['PLACED', 'ACCEPTED'].includes(currentStatus) && (
          <Button
            variant="outline"
            className="mb-6 text-red-400 border-red-400/30 hover:bg-red-500/10 rounded-2xl"
            onClick={() => {
              if (confirm('Are you sure you want to cancel this order?')) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        )}

        {/* Delivery Map */}
        {currentStatus === 'OUT_FOR_DELIVERY' && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Delivery partner location</h2>
            <LiveTrackingMap
              orderId={id}
              restaurantPosition={
                order.restaurant.latitude != null && order.restaurant.longitude != null
                  ? [order.restaurant.latitude, order.restaurant.longitude]
                  : null
              }
              destinationPosition={
                order.deliveryAddress?.latitude != null &&
                order.deliveryAddress?.longitude != null
                  ? [order.deliveryAddress.latitude, order.deliveryAddress.longitude]
                  : null
              }
            />
          </div>
        )}

        {/* Items */}
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="bg-zinc-900 rounded-2xl p-4 border border-white/10 space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-white/80">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="text-white/60">₹{(item.priceAtOrder * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center bg-zinc-900 rounded-2xl p-4 border border-white/10">
          <span className="font-bold">Total</span>
          <span className="text-2xl font-bold text-orange-400">₹{order.totalAmount.toFixed(2)}</span>
        </div>

        {/* Review Form */}
        {currentStatus === 'DELIVERED' && !hasReviewed && (
          <ReviewForm orderId={id} onDone={() => setHasReviewed(true)} />
        )}
        {hasReviewed && (
          <p className="text-white/40 text-sm mt-4">✅ Thanks for your review!</p>
        )}
      </div>
    </div>
  );
}

export default OrderTracking;