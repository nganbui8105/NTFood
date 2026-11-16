import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: {
    id: 'u1',
    name: 'Kim Ngân',
    email: 'kimngan@iuh.edu.vn',
    phone: '0908123456',
    address: 'Khu Ký túc xá / Đường Nguyễn Gia Trí, Q. Bình Thạnh, TP.HCM',
  },
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ email: string; name?: string }>) => {
      state.isLoggedIn = true;
      state.user = {
        id: 'u1',
        name: action.payload.name || state.user?.name || 'Khách hàng ShopeeFood',
        email: action.payload.email,
        phone: state.user?.phone || '0908123456',
        address: state.user?.address || 'Quận Bình Thạnh, TP.HCM',
      };
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;