import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  userData: TUser | null;
  userOrders: TOrder[];
  errorText: string;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  userData: null,
  userOrders: [],
  errorText: ''
};

export const fetchUserData = createAsyncThunk(
  'userSlice/fetchUserData',
  getUserApi
);

export const registerUser = createAsyncThunk(
  'userSlice/registerUser',
  async (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    })
);

export const loginUser = createAsyncThunk(
  'userSlice/loginUser',
  async (data: TLoginData) =>
    loginUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    })
);

export const logoutUser = createAsyncThunk('userSlice/logoutUser', async () =>
  logoutApi().then(() => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  })
);

export const updateUserData = createAsyncThunk(
  'userSlice/updateUserData',
  async (userData: Partial<TRegisterData>) => updateUserApi(userData)
);

export const fetchUserOrders = createAsyncThunk(
  'userSlice/fetchUserOrders',
  getOrdersApi
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetErrorText: (state) => {
      state.errorText = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state) => {
      state.isAuthChecked = false;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.userData = action.payload.user;
      state.isAuthChecked = true;
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      state.isAuthChecked = true;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.errorText = '';
      state.isAuthChecked = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.errorText = action.error.message || 'Что-то пошло не так';
      state.isAuthChecked = true;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isAuthChecked = false;
      state.errorText = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.isAuthChecked = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isAuthChecked = true;
      state.errorText = action.error.message || 'Что-то пошло не так';
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userData = null;
    });
    builder.addCase(updateUserData.pending, (state) => {
      state.errorText = '';
    });
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.userData = action.payload.user;
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.errorText = action.error.message || 'Что-то пошло не так';
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.userOrders = action.payload;
    });
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserData: (state) => state.userData,
    getUserOrders: (state) => state.userOrders,
    getErrorText: (state) => state.errorText
  }
});

export const { resetErrorText } = userSlice.actions;
export const { getIsAuthChecked, getUserData, getUserOrders, getErrorText } =
  userSlice.selectors;
export default userSlice.reducer;
