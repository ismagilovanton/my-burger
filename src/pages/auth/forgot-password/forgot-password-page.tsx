import { MainLayout } from '@/layouts/main-layout/main-layout';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './forgot-password-page.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <form className={styles.form}>
          <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
          <Input
            type="email"
            placeholder="Укажите e-mail"
            extraClass="mb-6"
            value=""
            onChange={() => undefined}
          />
          <Button htmlType="button" type="primary" size="medium" extraClass="mb-20">
            Восстановить
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
