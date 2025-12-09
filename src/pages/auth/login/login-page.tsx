import { MainLayout } from '@/layouts/main-layout/main-layout';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <form className={styles.form}>
          <h1 className="text text_type_main-medium mb-6">Вход</h1>
          <Input
            type="email"
            placeholder="E-mail"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
          <PasswordInput
            placeholder="Пароль"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
          <Button htmlType="button" type="primary" size="medium" extraClass="mb-20">
            Войти
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
    </MainLayout>
  );
};
