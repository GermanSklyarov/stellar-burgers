import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedState = {
  isFeedsLoading: boolean;
  error: string;
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
};

const initialState: TFeedState = {
  isFeedsLoading: false,
  error: '',
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  }
};

export const fetchFeeds = createAsyncThunk('feedSlice/fetchFeeds', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.pending, (state) => {
      state.isFeedsLoading = true;
      state.error = '';
    });
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.isFeedsLoading = false;
      state.orders = action.payload.orders;
      state.feed = {
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };
    });
    builder.addCase(fetchFeeds.rejected, (state, action) => {
      state.isFeedsLoading = false;
      state.error = action.error.message || 'Что-то пошло не так';
    });
  },
  selectors: {
    getIsFeedsLoading: (state) => state.isFeedsLoading,
    getOrders: (state) => state.orders,
    getFeed: (state) => state.feed
  }
});

export const { getIsFeedsLoading, getOrders, getFeed } = feedSlice.selectors;
export default feedSlice.reducer;
