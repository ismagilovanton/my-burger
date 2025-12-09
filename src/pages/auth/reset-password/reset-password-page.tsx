import { MainLayout } from '@/layouts/main-layout/main-layout';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <form className={styles.form}>
          <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
          <PasswordInput
            placeholder="Введите новый пароль"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
          <Input
            type="text"
            placeholder="Введите код из письма"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
          <Button htmlType="button" type="primary" size="medium" extraClass="mb-20">
            Сохранить
          </Button>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{' '}
            <a href="/login" className={styles.link}>
              Войти
            </a>
          </p>
        </form>
      </section>
    </MainLayout>
  );
};
