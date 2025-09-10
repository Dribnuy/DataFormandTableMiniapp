import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from './types';
import { initialState } from './initialState';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    loginUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    logoutUser: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); 
    },
    loadUserFromStorage: (state: AuthState) => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        state.user = JSON.parse(savedUser);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { registerUser, loginUser, logoutUser, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;