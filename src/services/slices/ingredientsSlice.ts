import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  isIngredientsLoading: boolean;
  ingredients: TIngredient[];
  error: string;
};

export const initialState: TIngredientsState = {
  isIngredientsLoading: false,
  ingredients: [],
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredientsSlice/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isIngredientsLoading = true;
      state.error = '';
    });
    builder.addCase(
      fetchIngredients.fulfilled,
      (state, action: PayloadAction<TIngredient[]>) => {
        state.ingredients = action.payload;
        state.isIngredientsLoading = false;
      }
    );
    builder.addCase(fetchIngredients.rejected, (state, action) => {
      state.isIngredientsLoading = false;
      state.error = action.error.message || 'Что-то пошло не так';
    });
  },
  selectors: {
    getIsIngredientsLoading: (state) => state.isIngredientsLoading,
    getIngredients: (state) => state.ingredients,
    getBuns: createSelector(
      [(state) => state.ingredients],
      (ingredients: TIngredient[]) =>
        ingredients.filter((ingredient) => ingredient.type === 'bun')
    ),
    getMains: createSelector(
      [(state) => state.ingredients],
      (ingredients: TIngredient[]) =>
        ingredients.filter((ingredient) => ingredient.type === 'main')
    ),
    getSauces: createSelector(
      [(state) => state.ingredients],
      (ingredients: TIngredient[]) =>
        ingredients.filter((ingredient) => ingredient.type === 'sauce')
    )
  }
});

export const {
  getIsIngredientsLoading,
  getIngredients,
  getBuns,
  getMains,
  getSauces
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
