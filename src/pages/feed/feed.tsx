import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchFeeds,
  getIsFeedsLoading,
  getOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const orders = useSelector(getOrders);
  const isFeedsLoading = useSelector(getIsFeedsLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (isFeedsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
