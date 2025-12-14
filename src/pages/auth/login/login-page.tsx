import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginUser } from '@/services/auth/authSlice';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import type React from 'react';
import type { Location } from 'react-router-dom';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error, user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';

  const from = useMemo(() => {
    const state = location.state as { from?: Location } | null;
    return state?.from?.pathname || '/';
  }, [location.state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    void dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded' && user) {
      void navigate(from, { replace: true });
    }
  }, [status, user, navigate, from]);

  return (
    <section className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <Input
          type="email"
          placeholder="E-mail"
          extraClass="mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          placeholder="Пароль"
          extraClass="mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="text text_type_main-default text_color_error mb-4">{error}</p>
        )}
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={isLoading}
        >
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </form>
    </section>
  );
};
