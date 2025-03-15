import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchUserOrders,
  getUserOrders
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getUserOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
