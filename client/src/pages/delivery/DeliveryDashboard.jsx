import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getMyOrders, updateOrderStatus } from '@/services/orderService';
import { getAvailableOrders, assignOrderToMe } from '@/services/deliveryService';
import { useDeliveryLocationSharing } from '@/hooks/useDeliveryLocationSharing';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function DeliveryDashboard() {
  const { accessToken } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [isSharing, setIsSharing] = useState(false);

  const { data: myOrders, isLoading: loadingMine } = useQuery({
    queryKey: ['delivery-my-orders'],
    queryFn: getMyOrders,
    refetchInterval: 10000,
  });

  const activeOrder = myOrders?.find((o) => o.status === 'OUT_FOR_DELIVERY');

  const { data: availableOrders, isLoading: loadingAvailable } = useQuery({
    queryKey: ['available-orders'],
    queryFn: getAvailableOrders,
    enabled: !activeOrder,
    refetchInterval: 8000,
  });

  const assignMutation = useMutation({
    mutationFn: assignOrderToMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
    },
  });

  const deliverMutation = useMutation({
    mutationFn: (orderId) => updateOrderStatus(orderId, 'DELIVERED'),
    onSuccess: () => {
      setIsSharing(false);
      queryClient.invalidateQueries({ queryKey: ['delivery-my-orders'] });
    },
  });

  const { error: locationError } = useDeliveryLocationSharing(
    activeOrder?.id,
    accessToken,
    isSharing
  );

  if (loadingMine) return <div className="container py-10">Loading...</div>;

  if (activeOrder) {
    return (
      <div className="container py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Active Delivery</h1>
        <p className="text-muted-foreground mb-6">
          {activeOrder.restaurant.name} → {activeOrder.customer?.name || 'Customer'}
        </p>

        <Card className="mb-6">
          <CardContent>
            <p className="font-medium mb-2">
              Deliver to: {activeOrder.deliveryAddress?.street},{' '}
              {activeOrder.deliveryAddress?.city}
            </p>
            <div className="text-sm space-y-1">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.menuItem.name} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-semibold mt-3">
              ₹{activeOrder.totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 mb-4">
          <Button
            variant={isSharing ? 'outline' : 'default'}
            onClick={() => setIsSharing((s) => !s)}
          >
            {isSharing ? 'Stop sharing location' : 'Start sharing location'}
          </Button>
          {isSharing && (
            <span className="text-sm text-muted-foreground">
              Broadcasting your live location...
            </span>
          )}
        </div>

        {locationError && (
          <p className="text-destructive text-sm mb-4">{locationError}</p>
        )}

        <Button
          className="w-full"
          onClick={() => deliverMutation.mutate(activeOrder.id)}
          disabled={deliverMutation.isPending}
        >
          {deliverMutation.isPending ? 'Updating...' : 'Mark as Delivered'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Available Deliveries</h1>

      {loadingAvailable && <p>Loading available orders...</p>}
      {availableOrders?.length === 0 && (
        <p className="text-muted-foreground">
          No orders ready for pickup right now.
        </p>
      )}

      <div className="space-y-4">
        {availableOrders?.map((order) => (
          <Card key={order.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-medium">{order.restaurant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} item(s) · ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => assignMutation.mutate(order.id)}
                disabled={assignMutation.isPending}
              >
                Accept Delivery
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DeliveryDashboard;