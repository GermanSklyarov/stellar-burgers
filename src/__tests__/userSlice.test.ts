import { getOrdersApi, getUserApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { userDataResult, userOrdersData } from '../mocks/userData';
import userSliceReducer, {
  fetchUserData,
  fetchUserOrders,
  initialState,
  resetErrorText
} from '../services/slices/userSlice';

jest.mock('@api');

describe('тесты синхронных экшенов', () => {
  test('сбросить ошибку', () => {
    const userState = {
      isAuthChecked: true,
      userData: null,
      userOrders: [],
      errorText: 'Ошибка получения данных'
    };

    const newState = userSliceReducer(userState, resetErrorText());
    const { errorText } = newState;

    expect(errorText).toBeFalsy();
  });
});

describe('тест асинхронных экшенов', () => {
  describe('тест асинхронного экшена fetchUserData', () => {
    it('проверка состояния pending', async () => {
      const newState = userSliceReducer(
        initialState,
        fetchUserData.pending('pending')
      );

      const { isAuthChecked } = newState;
      expect(isAuthChecked).toBeFalsy;
    });

    it('проверка состояния fulfilled', async () => {
      (getUserApi as jest.Mock).mockImplementation(() =>
        Promise.resolve(userDataResult)
      );

      const store = configureStore({
        reducer: { user: userSliceReducer }
      });

      await store.dispatch(fetchUserData());

      const { userData, isAuthChecked } = store.getState().user;
      expect(userData).toEqual(userDataResult.user);
      expect(isAuthChecked).toBeTruthy();
    });

    it('проверка состояния rejected', async () => {
      const requestError = {
        name: 'error',
        message: 'Ошибка получения данных'
      };

      (getUserApi as jest.Mock).mockImplementation(() =>
        Promise.reject(requestError)
      );

      const store = configureStore({
        reducer: { user: userSliceReducer }
      });

      await store.dispatch(fetchUserData());

      const { isAuthChecked } = store.getState().user;
      expect(isAuthChecked).toBeTruthy();
    });
  });

  describe('тест асинхронного экшена fetchUserOrders', () => {
    it('проверка состояния fulfilled', async () => {
      (getOrdersApi as jest.Mock).mockImplementation(() =>
        Promise.resolve(userOrdersData)
      );

      const store = configureStore({
        reducer: { user: userSliceReducer }
      });

      await store.dispatch(fetchUserOrders());

      const { userOrders } = store.getState().user;
      expect(userOrders).toEqual(userOrdersData);
    });
  });
});
