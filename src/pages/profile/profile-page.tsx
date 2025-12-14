import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchUser, logoutUser, updateUser } from '@/services/auth/authSlice';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
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

  const handleLogout = (): void => {
    void dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <section className={styles.page}>
      <aside className={styles.sidebar}>
        <nav>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.navItemActive : styles.navItemInactive
              } text text_type_main-medium`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              `${styles.navItem} ${
                isActive ? styles.navItemActive : styles.navItemInactive
              } text text_type_main-medium`
            }
          >
            История заказов
          </NavLink>
          <p
            className={`${styles.navItem} ${styles.navItemInactive} text text_type_main-medium`}
            onClick={handleLogout}
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
        <Routes>
          <Route
            index
            element={
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
            }
          />
          <Route
            path="orders"
            element={
              <p className="text text_type_main-default text_color_inactive">
                История заказов пока пуста.
              </p>
            }
          />
        </Routes>
      </div>
    </section>
  );
};
