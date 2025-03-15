import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { getUserData } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserData)?.name;
  return <AppHeaderUI userName={userName} />;
};
