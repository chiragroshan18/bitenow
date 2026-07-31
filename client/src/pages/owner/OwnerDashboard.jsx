import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/services/menuItemService';
import { createRestaurant, updateRestaurant } from '@/services/restaurantService';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

// Fetches the current owner's restaurant via /auth/me + a lookup workaround:
// we don't have a direct "my restaurant" endpoint, so we search the public
// list for the one matching this owner. Simple and works for this scale.
const findMyRestaurant = async (ownerId) => {
  const res = await apiClient.get('/restaurants');
  return res.data.data.find((r) => r.ownerId === ownerId) || null;
};

function OwnerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    address: '',
    description: '',
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['my-restaurant', user.id],
    queryFn: () => findMyRestaurant(user.id),
  });

  const { data: menuItems } = useQuery({
    queryKey: ['menu-items', restaurant?.id],
    queryFn: () => getMenuItems(restaurant.id),
    enabled: !!restaurant,
  });

  const createRestaurantMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-restaurant'] });
      setShowCreateForm(false);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (data) => createMenuItem(restaurant.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurant.id] });
      setShowItemForm(false);
      setItemForm({ name: '', price: '', category: '', description: '' });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }) => updateMenuItem(restaurant.id, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurant.id] });
      setEditingItem(null);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => deleteMenuItem(restaurant.id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurant.id] });
    },
  });

  const toggleAvailability = (item) => {
    updateItemMutation.mutate({
      itemId: item.id,
      data: { isAvailable: !item.isAvailable },
    });
  };

  if (isLoading) return <div className="container py-10">Loading...</div>;

  // No restaurant yet — show creation form.
  if (!restaurant) {
    return (
      <div className="container max-w-md py-10">
        <h1 className="text-2xl font-bold mb-4">Set up your restaurant</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRestaurantMutation.mutate(restaurantForm);
          }}
          className="space-y-3"
        >
          <div>
            <Label>Restaurant name</Label>
            <Input
              value={restaurantForm.name}
              onChange={(e) =>
                setRestaurantForm({ ...restaurantForm, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              placeholder="e.g. 45 Peters Road, Royapettah, Chennai"
              value={restaurantForm.address}
              onChange={(e) =>
                setRestaurantForm({ ...restaurantForm, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Input
              value={restaurantForm.description}
              onChange={(e) =>
                setRestaurantForm({
                  ...restaurantForm,
                  description: e.target.value,
                })
              }
            />
          </div>
          <Button type="submit" disabled={createRestaurantMutation.isPending}>
            {createRestaurantMutation.isPending ? 'Creating...' : 'Create restaurant'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground">{restaurant.address}</p>
        </div>
        <Link to="/owner/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Menu Items</h2>
        <Button onClick={() => setShowItemForm(!showItemForm)}>
          {showItemForm ? 'Cancel' : '+ Add item'}
        </Button>
      </div>

      {showItemForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createItemMutation.mutate({
              ...itemForm,
              price: parseFloat(itemForm.price),
            });
          }}
          className="space-y-3 mb-6 p-4 border border-input rounded-md"
        >
          <div>
            <Label>Item name</Label>
            <Input
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm({ ...itemForm, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                placeholder="e.g. Rice, Beverages"
                value={itemForm.category}
                onChange={(e) =>
                  setItemForm({ ...itemForm, category: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Input
              value={itemForm.description}
              onChange={(e) =>
                setItemForm({ ...itemForm, description: e.target.value })
              }
            />
          </div>
          <Button type="submit" disabled={createItemMutation.isPending}>
            {createItemMutation.isPending ? 'Adding...' : 'Add item'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {menuItems?.length === 0 && (
          <p className="text-muted-foreground">No menu items yet.</p>
        )}
        {menuItems?.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{item.price.toFixed(2)} · {item.category}
                </p>
                {!item.isAvailable && (
                  <p className="text-xs text-destructive">Unavailable</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toggleAvailability(item)}
                >
                  {item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => deleteItemMutation.mutate(item.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;
