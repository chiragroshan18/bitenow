import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, updateOrderStatus } from '@/services/orderService';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const NEXT_STATUS = {
  PLACED: 'ACCEPTED',
  ACCEPTED: 'PREPARING',
  PREPARING: 'READY_FOR_PICKUP',
  READY_FOR_PICKUP: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

const STATUS_LABELS = {
  PLACED: 'New order',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for pickup',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

function OwnerOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: getMyOrders,
    refetchInterval: 10000, // poll every 10s as a fallback alongside sockets
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
    },
  });

  if (isLoading) return <div className="container py-10">Loading orders...</div>;

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Incoming Orders</h1>

      {orders?.length === 0 && (
        <p className="text-muted-foreground">No orders yet.</p>
      )}

      <div className="space-y-4">
        {orders?.map((order) => {
          const nextStatus = NEXT_STATUS[order.status];
          return (
            <Card key={order.id}>
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer.name} · {order.customer.email}
                    </p>
                  </div>
                  <span className="text-sm font-medium px-2 py-1 rounded bg-secondary">
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="text-sm space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span>₹{(item.priceAtOrder * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>

                  {nextStatus && (
                    <Button
                      onClick={() =>
                        statusMutation.mutate({ id: order.id, status: nextStatus })
                      }
                      disabled={statusMutation.isPending}
                    >
                      Mark as {STATUS_LABELS[nextStatus]}
                    </Button>
                  )}

                  {order.status === 'PLACED' && (
                    <Button
                      variant="ghost"
                      className="text-destructive ml-2"
                      onClick={() =>
                        statusMutation.mutate({ id: order.id, status: 'CANCELLED' })
                      }
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default OwnerOrders;