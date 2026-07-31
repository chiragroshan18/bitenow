import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGlobalLoading: false,
  toast: null, // { type: 'success' | 'error' | 'info', message: string }
  darkMode: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    toggleDarkMode: (state) => { // ← ADDED
      state.darkMode = !state.darkMode;
    },
  },
});

export const { setGlobalLoading, showToast, clearToast, toggleDarkMode } = uiSlice.actions; // ← UPDATED
export default uiSlice.reducer;