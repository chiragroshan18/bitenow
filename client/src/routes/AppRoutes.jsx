import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RestaurantDetail from '@/pages/RestaurantDetail';
import Cart from '@/pages/Cart';
import OrderTracking from '@/pages/OrderTracking';
import MyOrders from '@/pages/MyOrders';
import Favorites from '@/pages/Favorites';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import OwnerOrders from '@/pages/owner/OwnerOrders';
import DeliveryDashboard from '@/pages/delivery/DeliveryDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import NotFound from '@/pages/NotFound';
import PrivateRoute from './PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />

      <Route element={<PrivateRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/:id" element={<OrderTracking />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>

      <Route element={<PrivateRoute roles={['RESTAURANT_OWNER']} />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/orders" element={<OwnerOrders />} />
      </Route>

      <Route element={<PrivateRoute roles={['DELIVERY_PARTNER']} />}>
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Route>

      <Route element={<PrivateRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;