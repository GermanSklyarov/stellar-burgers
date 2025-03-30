import { orderBurgerApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { orderDataResult } from '../mocks/orderData';
import orderSliceReducer, {
    postOrder,
    resetOrder
} from '../services/slices/orderSlice';

jest.mock('@api');

describe('тесты синхронных экшенов', () => {
  test('сбросить заказ', () => {
    const orderState = {
      isOrderRequest: false,
      error: '',
      order: {
        ingredients: [
          'Краторная булка N-200i',
          'Соус Spicy-X',
          'Краторная булка N-200i'
        ],
        _id: '67e44d766fce7d001db5c7c1',
        status: 'done',
        name: 'Краторный spicy бургер',
        createdAt: '2025-03-26T18:54:46.852Z',
        updatedAt: '2025-03-26T18:54:47.459Z',
        number: 72259
      }
    };

    const newState = orderSliceReducer(orderState, resetOrder());
    const { order } = newState;

    expect(order).toBeNull();
  });
});

describe('тест асинхронного экшена postOrder', () => {
  const initialState = {
    isOrderRequest: false,
    error: '',
    order: null
  };

  const orderData = [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa093c'
  ];

  it('проверка состояния pending', async () => {
    const newState = orderSliceReducer(
      initialState,
      postOrder.pending('pending', orderData)
    );

    const { isOrderRequest, error } = newState;
    expect(isOrderRequest).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('проверка состояния fulfilled', async () => {
    (orderBurgerApi as jest.Mock).mockImplementation(() =>
      Promise.resolve(orderDataResult)
    );

    const store = configureStore({
      reducer: { order: orderSliceReducer }
    });

    await store.dispatch(postOrder(orderData));

    const { order, isOrderRequest } = store.getState().order;
    expect(order).toEqual(orderDataResult.order);
    expect(isOrderRequest).toBeFalsy();
  });

  it('проверка состояния rejected', async () => {
    const requestError = {
      name: 'error',
      message: 'Ошибка оформления заказа'
    };

    (orderBurgerApi as jest.Mock).mockImplementation(() =>
      Promise.reject(requestError)
    );

    const store = configureStore({
      reducer: { order: orderSliceReducer }
    });

    await store.dispatch(postOrder(orderData));

    const { error, isOrderRequest } = store.getState().order;
    expect(error).toEqual(requestError.message);
    expect(isOrderRequest).toBeFalsy();
  });
});
