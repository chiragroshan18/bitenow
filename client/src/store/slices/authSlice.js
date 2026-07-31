import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'auth';

const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const serializedState = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }

    const parsedState = JSON.parse(serializedState);
    return parsedState && typeof parsedState === 'object' ? parsedState : undefined;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore storage errors
  }
};

const clearState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    // Ignore storage errors
  }
};

const initialState = loadState() || {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      saveState(state);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      clearState();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;``