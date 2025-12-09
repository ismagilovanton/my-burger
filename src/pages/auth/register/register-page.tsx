import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { MainLayout } from '@/layouts/main-layout/main-layout';
import { registerUser } from '@/services/auth/authSlice';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error, user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!name || !email || !password) {
      return;
    }

    void dispatch(registerUser({ name, email, password }));
  };

  useEffect(() => {
    if (user) {
      void navigate('/');
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
          <Input
            type="text"
            placeholder="Имя"
            extraClass="mb-6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
          </Button>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </form>
      </section>
    </MainLayout>
  );
};
