import { ForgotPasswordPage } from '@/pages/auth/forgot-password/forgot-password-page';
import { LoginPage } from '@/pages/auth/login/login-page';
import { RegisterPage } from '@/pages/auth/register/register-page';
import { ResetPasswordPage } from '@/pages/auth/reset-password/reset-password-page';
import { HomePage } from '@/pages/home/home-page';
import { IngredientsDetailPage } from '@/pages/ingredients/ingredients-detail/ingredients-detail-page';
import { NotFoundPage } from '@/pages/not-found/not-found-page';
import { ProfilePage } from '@/pages/profile/profile-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ingredients/:id" element={<IngredientsDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
