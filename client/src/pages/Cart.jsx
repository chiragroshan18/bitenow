import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { removeItem, clearCart, decrementItem } from '@/store/slices/cartSlice';
import { createAddress, getMyAddresses } from '@/services/addressService';
import { placeOrder } from '@/services/orderService';
import { showToast } from '@/store/slices/uiSlice';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

function Cart() {
  const { items, restaurantName } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '',
  });
  const [error, setError] = useState(null);

  const { data: addresses, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: getMyAddresses,
  });

  const addAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: (created) => {
      refetch();
      setSelectedAddressId(created.id);
      setShowNewAddress(false);
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (order) => {
      dispatch(clearCart());
      dispatch(showToast({ type: 'success', message: 'Order placed successfully!' }));
      navigate(`/orders/${order.id}`);
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to place order.';
      setError(message);
      dispatch(showToast({ type: 'error', message }));
    },
  });

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = () => {
    setError(null);
    if (!selectedAddressId) {
      setError('Please select or add a delivery address.');
      return;
    }
    placeOrderMutation.mutate({
      addressId: selectedAddressId,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
    });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddressMutation.mutate(newAddress);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-white/40 mb-6">Browse restaurants and add items.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-2xl transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Your Cart</h1>
        <p className="text-white/40 text-sm mb-6">from {restaurantName}</p>

        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <motion.div
              key={item.menuItemId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 rounded-2xl p-4 border border-white/10 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-white/40 text-sm">₹{item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-orange-400 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => {
                    dispatch(removeItem(item.menuItemId));
                    dispatch(showToast({ type: 'info', message: 'Removed item from cart' }));
                  }}
                  className="text-white/40 hover:text-red-400 transition text-xl"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center bg-zinc-900 rounded-2xl p-4 border border-white/10 mb-6">
          <span className="font-bold text-lg">Total</span>
          <span className="text-2xl font-bold text-orange-400">₹{total.toFixed(2)}</span>
        </div>

        {/* Address Section */}
        <h2 className="font-bold mb-3">Delivery Address</h2>

        {addresses && addresses.length > 0 && (
          <div className="space-y-2 mb-4">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  selectedAddressId === addr.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/10 bg-zinc-900 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1 accent-orange-500"
                />
                <div>
                  <p className="font-medium">{addr.label}</p>
                  <p className="text-white/40 text-sm">
                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}

        {!showNewAddress ? (
          <button
            onClick={() => setShowNewAddress(true)}
            className="w-full py-3 rounded-2xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition"
          >
            + Add new address
          </button>
        ) : (
          <form onSubmit={handleAddAddress} className="bg-zinc-900 rounded-2xl p-4 border border-white/10 space-y-3">
            <div>
              <Label className="text-white/60">Label</Label>
              <Input
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="bg-[#0d0d0d] border-white/10 text-white rounded-xl"
              />
            </div>
            <div>
              <Label className="text-white/60">Street / Area</Label>
              <Input
                placeholder="e.g. 12 Besant Road, Royapettah"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="bg-[#0d0d0d] border-white/10 text-white rounded-xl"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/60">City</Label>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="bg-[#0d0d0d] border-white/10 text-white rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-white/60">State</Label>
                <Input
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="bg-[#0d0d0d] border-white/10 text-white rounded-xl"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-white/60">Postal Code</Label>
              <Input
                placeholder="e.g. 600004"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="bg-[#0d0d0d] border-white/10 text-white rounded-xl"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-400 rounded-2xl" disabled={addAddressMutation.isPending}>
              {addAddressMutation.isPending ? 'Saving...' : 'Save address'}
            </Button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          className="w-full mt-6 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl transition active:scale-[0.98] disabled:opacity-50"
        >
          {placeOrderMutation.isPending ? 'Placing order...' : `Place Order — ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

export default Cart;