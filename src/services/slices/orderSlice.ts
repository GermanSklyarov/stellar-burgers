import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  isOrderRequest: boolean;
  error: string;
  order: TOrder | null;
};

const initialState: TOrderState = {
  isOrderRequest: false,
  error: '',
  order: null
};

export const postOrder = createAsyncThunk(
  'orderSlice/postOrder',
  async (data: string[]) => orderBurgerApi(data)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(postOrder.pending, (state) => {
      state.isOrderRequest = true;
      state.error = '';
    });
    builder.addCase(postOrder.fulfilled, (state, action) => {
      state.order = action.payload.order;
      state.isOrderRequest = false;
    });
    builder.addCase(postOrder.rejected, (state, action) => {
      state.isOrderRequest = false;
      state.error = action.error.message || 'Что-то пошло не так';
    });
  },
  selectors: {
    getIsOrderRequest: (state) => state.isOrderRequest,
    getOrder: (state) => state.order
  }
});

export const { resetOrder } = orderSlice.actions;
export const { getIsOrderRequest, getOrder } = orderSlice.selectors;
export default orderSlice.reducer;
