import { rootReducer } from '../services/store';
import { initialState as initialBurgerConstructorState } from '../services/slices/burgerConstructorSlice';
import { initialState as initialFeedState } from '../services/slices/feedSlice';
import { initialState as initialIngredientsState } from '../services/slices/ingredientsSlice';
import { initialState as initialOrderState } from '../services/slices/orderSlice';
import { initialState as initialUserState } from '../services/slices/userSlice';

describe('rootReducer', () => {
  it('should return the initial state when passed an undefined state and an unknown action', () => {
    const initialState = {
      burgerConstructor: {
        ...initialBurgerConstructorState
      },
      feed: {
        ...initialFeedState
      },
      ingredients: {
        ...initialIngredientsState
      },
      order: {
        ...initialOrderState
      },
      user: {
        ...initialUserState
      }
    };

    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(initialState);
  });
});
