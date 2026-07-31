import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [], // { menuItemId, name, price, quantity }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { menuItemId, name, price, restaurantId, restaurantName } =
        action.payload;

      // Cart can only hold items from one restaurant at a time,
      // matching the backend's "same restaurant" order rule (Module 9).
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existing = state.items.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ menuItemId, name, price, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (i) => i.menuItemId !== action.payload
      );
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
    },
    decrementItem: (state, action) => {
      const existing = state.items.find(
        (i) => i.menuItemId === action.payload
      );
      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.menuItemId !== action.payload
          );
        }
      }
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
    },
    clearCart: (state) => {
      state.restaurantId = null;
      state.restaurantName = null;
      state.items = [];
    },
  },
});

export const { addItem, removeItem, decrementItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;