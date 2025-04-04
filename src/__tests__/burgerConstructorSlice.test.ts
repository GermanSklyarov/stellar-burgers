import {
  bun,
  firstIngredient,
  secondIngredient
} from '../mocks/burgerConstructorData';
import burgerConstructorSliceReducer, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../services/slices/burgerConstructorSlice';

describe('тесты синхронных экшенов', () => {
  test('добавить ингредиент', () => {
    const newState = burgerConstructorSliceReducer(
      initialState,
      addIngredient(firstIngredient)
    );
    const { constructorItems } = newState;

    expect(constructorItems.ingredients.length).toBe(1);
    expect(constructorItems.ingredients[0]._id).toBe(
      '643d69a5c3f7b9001cfa0941'
    );
  });

  test('добавить булку', () => {
    const newState = burgerConstructorSliceReducer(
      initialState,
      addIngredient(bun)
    );
    const { constructorItems } = newState;
    expect(constructorItems.bun?._id).toBe('643d69a5c3f7b9001cfa093c');
  });

  test('удалить ингредиент', () => {
    const newState = burgerConstructorSliceReducer(
      {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient]
        }
      },
      removeIngredient('1')
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([]);
  });

  test('поднять ингредиент', () => {
    const newState = burgerConstructorSliceReducer(
      {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        }
      },
      moveIngredientUp(1)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
  });

  test('опустить ингредиент', () => {
    const newState = burgerConstructorSliceReducer(
      {
        constructorItems: {
          bun: null,
          ingredients: [firstIngredient, secondIngredient]
        }
      },
      moveIngredientDown(0)
    );

    const { constructorItems } = newState;

    expect(constructorItems.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
  });
});
