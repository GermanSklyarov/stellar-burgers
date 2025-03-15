import { Preloader } from '@ui';
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import {
  getIsAuthChecked,
  getUserData,
  resetErrorText
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: ReactNode;
  isOnlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  isOnlyUnAuth = false
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUserData);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetErrorText());
    },
    [location.pathname]
  );

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isOnlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (isOnlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
