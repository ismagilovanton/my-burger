import { MainLayout } from '@/layouts/main-layout/main-layout';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <form className={styles.form}>
          <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
          <Input
            type="text"
            placeholder="Имя"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
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
            Зарегистрироваться
          </Button>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{' '}
            <a href="/login" className={styles.link}>
              Войти
            </a>
          </p>
        </form>
      </section>
    </MainLayout>
  );
};
