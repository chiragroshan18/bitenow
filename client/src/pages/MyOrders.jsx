import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMyOrders } from '@/services/orderService';
import { Card, CardContent } from '@/components/ui/Card';
import { addItem, clearCart } from '@/store/slices/cartSlice';

const STATUS_LABELS = {
  PLACED: 'Order placed',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for pickup',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS = {
  DELIVERED: 'text-green-600',
  CANCELLED: 'text-destructive',
};

function MyOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders-history'],
    queryFn: getMyOrders,
  });

  const handleReorder = (order, e) => {
    e.preventDefault(); // don't navigate into the tracking page
    dispatch(clearCart());
    order.items.forEach((item) => {
      dispatch(
        addItem({
          menuItemId: item.menuItemId,
          name: item.menuItem.name,
          price: item.menuItem.price,
          restaurantId: order.restaurantId,
          restaurantName: order.restaurant.name,
        })
      );
    });
    navigate('/cart');
  };

  if (isLoading) return <div className="container py-10">Loading orders...</div>;

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders?.length === 0 && (
        <p className="text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      )}

      <div className="space-y-3">
        {orders?.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.restaurant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item(s) ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                  <p
                    className={`text-sm ${
                      STATUS_COLORS[order.status] || 'text-muted-foreground'
                    }`}
                  >
                    {STATUS_LABELS[order.status]}
                  </p>
                  {order.status === 'DELIVERED' && (
                    <button
                      onClick={(e) => handleReorder(order, e)}
                      className="text-xs text-primary underline mt-1"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;