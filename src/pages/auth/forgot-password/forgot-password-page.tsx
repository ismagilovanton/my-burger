import { useForgotPassword } from '@/hooks/useForgotPassword';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './forgot-password-page.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const { isLoading, forgotPassword } = useForgotPassword();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void forgotPassword(email);
  };

  return (
    <section className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <Input
          type="email"
          placeholder="Укажите e-mail"
          extraClass="mb-6"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={isLoading || !email}
        >
          {isLoading ? 'Отправка...' : 'Восстановить'}
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </section>
  );
};
