import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import burgerConstructor from './slices/burgerConstructorSlice';
import feed from './slices/feedSlice';
import ingredients from './slices/ingredientsSlice';
import order from './slices/orderSlice';
import user from './slices/userSlice';

const rootReducer = combineReducers({
  user,
  ingredients,
  burgerConstructor,
  feed,
  order
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
