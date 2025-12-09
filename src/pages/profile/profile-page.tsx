import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { MainLayout } from '@/layouts/main-layout/main-layout';
import { fetchUser, updateUser } from '@/services/auth/authSlice';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import type React from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';

  useEffect(() => {
    if (!user) {
      void dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  }, [user]);

  const isFormChanged =
    !!user && (user.name !== name || user.email !== email || password.length > 0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!user || !name || !email) {
      return;
    }

    const payload: { name: string; email: string; password?: string } = {
      name,
      email,
    };

    if (password) {
      payload.password = password;
    }

    void dispatch(updateUser(payload));
  };

  const handleCancel = (): void => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

    setPassword('');
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <aside className={styles.sidebar}>
          <nav>
            <p
              className={`${styles.navItem} ${styles.navItemActive} text text_type_main-medium`}
            >
              Профиль
            </p>
            <p
              className={`${styles.navItem} ${styles.navItemInactive} text text_type_main-medium`}
            >
              История заказов
            </p>
            <p
              className={`${styles.navItem} ${styles.navItemInactive} text text_type_main-medium`}
            >
              Выход
            </p>
          </nav>
          <p
            className={`${styles.description} text text_type_main-default text_color_inactive`}
          >
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </aside>
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Имя"
              extraClass="mb-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Логин"
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
              <p className="text text_type_main-default text_color_error mb-4">
                {error}
              </p>
            )}
            {isFormChanged && (
              <div className="mt-4">
                <Button
                  htmlType="button"
                  type="secondary"
                  size="medium"
                  extraClass="mr-6"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Сохраняем...' : 'Сохранить'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </section>
    </MainLayout>
  );
};
