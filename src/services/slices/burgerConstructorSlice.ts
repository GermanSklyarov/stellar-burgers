import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

type TConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload - 1,
        0,
        ...state.constructorItems.ingredients.splice(action.payload, 1)
      );
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(
        action.payload + 1,
        0,
        ...state.constructorItems.ingredients.splice(action.payload, 1)
      );
    },
    resetBurgerConstructor: () => ({ ...initialState })
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetBurgerConstructor
} = burgerConstructorSlice.actions;
export const { getConstructorItems } = burgerConstructorSlice.selectors;
export default burgerConstructorSlice.reducer;
