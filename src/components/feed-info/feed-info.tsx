import { FC } from 'react';

import { TOrder } from '@utils-types';
import {
  getFeed,
  getOrders as getOrdersFeed
} from '../..//services/slices/feedSlice';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getOrdersFeed);
  const feed = useSelector(getFeed);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
