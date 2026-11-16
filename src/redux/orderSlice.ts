import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { postOrderToApi } from '../api/axiosClient';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  submitting: boolean;
}

const initialState: OrderState = {
  orders: [],
  submitting: false,
};

// AsyncThunk gửi đơn hàng mới lên MockAPI qua Axios POST
export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (newOrder: Omit<Order, 'id'>) => {
    const savedOrder = await postOrderToApi(newOrder);
    return savedOrder;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    advanceOrderStatus: (state, action: PayloadAction<string>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (!order) return;
      const steps: Order['status'][] = [
        'Đã nhận đơn',
        'Đang chuẩn bị',
        'Đang giao hàng',
        'Hoàn thành',
      ];
      const currentIndex = steps.indexOf(order.status);
      if (currentIndex < steps.length - 1) {
        order.status = steps[currentIndex + 1];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.submitting = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const { advanceOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;