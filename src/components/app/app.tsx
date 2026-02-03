import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { Modal } from '@/components/modal/modal';
import {
  OrderDetail,
  type TOrderDetailIngredient,
} from '@/components/order-detail/order-detail';
import { ProtectedRouteElement } from '@/components/protected-route-element/protected-route-element';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { MainLayout } from '@/layouts/main-layout/main-layout';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password/forgot-password-page';
import { LoginPage } from '@/pages/auth/login/login-page';
import { RegisterPage } from '@/pages/auth/register/register-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password/reset-password-page';
import { FeedDetailPage } from '@/pages/feed/feed-detail/feed-detail-page';
import { FeedPage } from '@/pages/feed/feed-page';
import { HomePage } from '@/pages/home/home-page';
import { IngredientsDetailPage } from '@/pages/ingredients/ingredients-detail/ingredients-detail-page';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfileOrderDetailPage } from '@/pages/profile/orders/orders-detail/orders-detail-page';
import { ProfilePage } from '@/pages/profile/profile-page';
import { fetchIngredients } from '@/services/ingredients/ingredientsSlice';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import type React from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  backgroundLocation?: Location;
};

const mockOrderIngredients: TOrderDetailIngredient[] = [
  {
    _id: '1',
    name: 'Флуоресцентная булка R2-D3',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 20,
    image: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0,
    count: 2,
  },
  {
    _id: '2',
    name: 'Филе Люминесцентного тетраодонтиформа',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0,
    count: 1,
  },
  {
    _id: '3',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 30,
    image: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    __v: 0,
    count: 1,
  },
  {
    _id: '4',
    name: 'Плоды фалленианского дерева',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    __v: 0,
    count: 1,
  },
];

const AppRoutes = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as TLocationState | undefined;

  const backgroundLocation = state?.backgroundLocation ?? null;

  return (
    <MainLayout>
      <>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<ProtectedRouteElement onlyUnAuth element={<LoginPage />} />}
          />
          <Route
            path="/register"
            element={<ProtectedRouteElement onlyUnAuth element={<RegisterPage />} />}
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRouteElement onlyUnAuth element={<ForgotPasswordPage />} />
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRouteElement onlyUnAuth element={<ResetPasswordPage />} />
            }
          />
          <Route
            path="/profile/*"
            element={<ProtectedRouteElement element={<ProfilePage />} />}
          />
          <Route path="/ingredients/:id" element={<IngredientsDetailPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:id" element={<FeedDetailPage />} />
          <Route
            path="/profile/orders/:id"
            element={<ProtectedRouteElement element={<ProfileOrderDetailPage />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route path="/ingredients/:id" element={<IngredientDetailsModal />} />
            <Route path="/feed/:id" element={<FeedOrderModal />} />
            <Route
              path="/profile/orders/:id"
              element={<ProtectedRouteElement element={<ProfileOrderModal />} />}
            />
          </Routes>
        )}
      </>
    </MainLayout>
  );
};

const IngredientDetailsModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ingredient = useAppSelector((state) =>
    state.ingredients.items.find((item) => item._id === id)
  );

  const handleClose = (): void => {
    void navigate(-1);
  };

  if (!ingredient) {
    return null;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

const FeedOrderModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const orderNumber = (id ?? '034533').toString().padStart(6, '0');

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <Modal onClose={handleClose}>
      <OrderDetail
        orderNumber={orderNumber}
        name="Black Hole Singularity острый бургер"
        statusText="Выполнен"
        createdAt="Вчера, 13:50"
        ingredients={mockOrderIngredients}
      />
    </Modal>
  );
};

const ProfileOrderModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const orderNumber = (id ?? '034533').toString().padStart(6, '0');

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <Modal onClose={handleClose}>
      <OrderDetail
        orderNumber={orderNumber}
        name="Black Hole Singularity острый бургер"
        statusText="Выполнен"
        createdAt="Вчера, 13:50"
        ingredients={mockOrderIngredients}
      />
    </Modal>
  );
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.ingredients.status);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, status]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
