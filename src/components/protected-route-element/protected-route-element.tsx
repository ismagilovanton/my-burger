import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchUser } from '@/services/auth/authSlice';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { RootState } from '@/root-reducer';
import type React from 'react';
import type { Location } from 'react-router-dom';

type TProtectedRouteElementProps = {
  element: React.JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRouteElement = ({
  element,
  onlyUnAuth = false,
}: TProtectedRouteElementProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { user, isAuthChecked } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      void dispatch(fetchUser());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return (
      <div className="pt-30 text text_type_main-default text_color_inactive">
        Загрузка пользователя...
      </div>
    );
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location } | null)?.from;

    return <Navigate to={from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};
