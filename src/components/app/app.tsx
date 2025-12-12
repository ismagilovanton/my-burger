import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { Modal } from '@/components/modal/modal';
import { ProtectedRouteElement } from '@/components/protected-route-element/protected-route-element';
import { useAppSelector } from '@/hooks/redux';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password/forgot-password-page';
import { LoginPage } from '@/pages/auth/login/login-page';
import { RegisterPage } from '@/pages/auth/register/register-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password/reset-password-page';
import { HomePage } from '@/pages/home/home-page';
import { IngredientsDetailPage } from '@/pages/ingredients/ingredients-detail/ingredients-detail-page';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfilePage } from '@/pages/profile/profile-page';
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

const AppRoutes = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as TLocationState | undefined;

  const backgroundLocation = state?.backgroundLocation ?? null;

  return (
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
          element={<ProtectedRouteElement onlyUnAuth element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<ProtectedRouteElement onlyUnAuth element={<ResetPasswordPage />} />}
        />
        <Route
          path="/profile/*"
          element={<ProtectedRouteElement element={<ProfilePage />} />}
        />
        <Route path="/ingredients/:id" element={<IngredientsDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientDetailsModal />} />
        </Routes>
      )}
    </>
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

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
