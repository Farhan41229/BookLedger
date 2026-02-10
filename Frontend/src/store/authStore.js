import { create } from 'zustand';
import API from '@/lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  message: null,
  unverifiedEmail: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await API.post('/users/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Login failed';

      if (status === 403) {
        set({ isLoading: false, error: null, unverifiedEmail: email });
        return { success: false, unverified: true };
      }

      set({ isLoading: false, error: message });
      return { success: false, unverified: false };
    }
  },

  verifyEmail: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      await API.post('/users/verify-email', {
        email,
        code: parseInt(code, 10),
      });
      set({
        isLoading: false,
        message: 'Email verified successfully!',
        unverifiedEmail: null,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await API.post('/users/resend-verification', { email });
      set({ isLoading: false, message: res.data.message || 'Code resent!' });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend code';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await API.post('/users/forgot-password', { email });
      set({ isLoading: false, message: res.data.message || 'Reset email sent' });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Request failed';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      await API.post(`/users/reset-password/${token}`, { password });
      set({ isLoading: false, message: 'Password reset successful' });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isCheckingAuth: false });
      return;
    }

    set({ isCheckingAuth: true });
    try {
      const res = await API.get('/users/me');
      set({ user: res.data.user, isCheckingAuth: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isCheckingAuth: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      error: null,
      message: null,
      unverifiedEmail: null,
    });
  },

  clearError: () => set({ error: null }),
  clearMessage: () => set({ message: null }),
}));

export default useAuthStore;
