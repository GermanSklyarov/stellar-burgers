import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorItems,
  resetBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  getIsOrderRequest,
  getOrder,
  postOrder,
  resetOrder
} from '../../services/slices/orderSlice';
import { getUserData } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getIsOrderRequest);
  const orderModalData = useSelector(getOrder);
  const user = useSelector(getUserData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderData = useMemo(() => {
    const bunId = constructorItems.bun?._id ?? '';
    const ingredientsId = constructorItems.ingredients.map(
      (ingredient) => ingredient._id
    );
    return [bunId, ...ingredientsId, bunId];
  }, [constructorItems]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    dispatch(postOrder(orderData));
  };
  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(resetOrder());
    dispatch(resetBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
