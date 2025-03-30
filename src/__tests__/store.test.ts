import { rootReducer } from '../services/store';

describe('rootReducer', () => {
  it('should return the initial state when passed an undefined state and an unknown action', () => {
    const initialState = {
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        }
      },
      feed: {
        isFeedsLoading: false,
        error: '',
        orders: [],
        feed: {
          total: 0,
          totalToday: 0
        }
      },
      ingredients: {
        isIngredientsLoading: false,
        ingredients: [],
        error: ''
      },
      order: {
        isOrderRequest: false,
        error: '',
        order: null
      },
      user: {
        isAuthChecked: false,
        userData: null,
        userOrders: [],
        errorText: ''
      }
    };

    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual(initialState);
  });
});
