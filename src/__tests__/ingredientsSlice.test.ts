import { getIngredientsApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsData } from '../mocks/ingredientsData';
import ingredientsSliceReducer, {
  fetchIngredients
} from '../services/slices/ingredientsSlice';

jest.mock('@api');

describe('тест асинхронного экшена fetchIngredients', () => {
  const initialState = {
    isIngredientsLoading: false,
    ingredients: [],
    error: ''
  };
  it('проверка состояния pending', async () => {
    const newState = ingredientsSliceReducer(
      initialState,
      fetchIngredients.pending('pending')
    );

    const { isIngredientsLoading, error } = newState;
    expect(isIngredientsLoading).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('проверка состояния fulfilled', async () => {
    (getIngredientsApi as jest.Mock).mockImplementation(() =>
      Promise.resolve(ingredientsData)
    );

    const store = configureStore({
      reducer: { ingredients: ingredientsSliceReducer }
    });

    await store.dispatch(fetchIngredients());

    const { ingredients, isIngredientsLoading } = store.getState().ingredients;
    expect(ingredients).toEqual(ingredientsData);
    expect(isIngredientsLoading).toBeFalsy();
  });

  it('проверка состояния rejected', async () => {
    const requestError = {
      name: 'error',
      message: 'Ошибка получения ингредиентов'
    };

    (getIngredientsApi as jest.Mock).mockImplementation(() =>
      Promise.reject(requestError)
    );

    const store = configureStore({
      reducer: { ingredients: ingredientsSliceReducer }
    });

    await store.dispatch(fetchIngredients());

    const { error, isIngredientsLoading } = store.getState().ingredients;
    expect(error).toEqual(requestError.message);
    expect(isIngredientsLoading).toBeFalsy();
  });
});
