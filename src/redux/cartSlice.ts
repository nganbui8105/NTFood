import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AVAILABLE_VOUCHERS } from '../api/axiosClient';
import { CartItem, Food, Voucher } from '../types';

interface CartState {
  items: CartItem[];
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
}

const initialState: CartState = {
  items: [],
  vouchers: AVAILABLE_VOUCHERS,
  appliedVoucher: AVAILABLE_VOUCHERS[0], // Mặc định tặng sẵn mã Freeship 15k
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        food: Food;
        quantity?: number;
        size?: 'S' | 'M' | 'L';
        selectedToppings?: string[];
        note?: string;
      }>
    ) => {
      const { food, quantity = 1, size = 'M', selectedToppings = [], note = '' } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.food.id === food.id && item.size === size
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ food, quantity, size, selectedToppings, note });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ foodId: string; size: string; delta: number }>) => {
      const { foodId, size, delta } = action.payload;
      const index = state.items.findIndex(
        (item) => item.food.id === foodId && item.size === size
      );
      if (index >= 0) {
        state.items[index].quantity += delta;
        if (state.items[index].quantity <= 0) {
          state.items.splice(index, 1);
        }
      }
    },
    applyVoucher: (state, action: PayloadAction<Voucher | null>) => {
      state.appliedVoucher = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, applyVoucher, clearCart } = cartSlice.actions;
export default cartSlice.reducer;