import { getFeedsApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { feedsData } from '../mocks/feedaData';
import feedSliceReducer, {
  fetchFeeds,
  initialState
} from '../services/slices/feedSlice';

jest.mock('@api');

describe('тест асинхронного экшена fetchFeeds', () => {
  it('проверка состояния pending', async () => {
    const newState = feedSliceReducer(
      initialState,
      fetchFeeds.pending('pending')
    );

    const { isFeedsLoading, error } = newState;
    expect(isFeedsLoading).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('проверка состояния fulfilled', async () => {
    (getFeedsApi as jest.Mock).mockImplementation(() =>
      Promise.resolve(feedsData)
    );

    const store = configureStore({
      reducer: { feed: feedSliceReducer }
    });

    await store.dispatch(fetchFeeds());

    const { orders, feed, isFeedsLoading } = store.getState().feed;
    expect(orders).toEqual(feedsData.orders);
    expect(feed.total).toEqual(feedsData.total);
    expect(feed.totalToday).toEqual(feedsData.totalToday);
    expect(isFeedsLoading).toBeFalsy();
  });

  it('проверка состояния rejected', async () => {
    const requestError = {
      name: 'error',
      message: 'Ошибка получения данных'
    };

    (getFeedsApi as jest.Mock).mockImplementation(() =>
      Promise.reject(requestError)
    );

    const store = configureStore({
      reducer: { feed: feedSliceReducer }
    });

    await store.dispatch(fetchFeeds());

    const { error, isFeedsLoading } = store.getState().feed;
    expect(error).toEqual(requestError.message);
    expect(isFeedsLoading).toBeFalsy();
  });
});
