import { useResetPassword } from '@/hooks/useResetPassword';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type React from 'react';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const { isLoading, resetPassword } = useResetPassword();
  const navigate = useNavigate();

  useEffect(() => {
    const isAllowed = sessionStorage.getItem('resetPasswordAllowed');

    if (!isAllowed) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void resetPassword({ password, token });
  };

  return (
    <section className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <PasswordInput
          placeholder="Введите новый пароль"
          extraClass="mb-6"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          extraClass="mb-6"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <Button
          htmlType="submit"
          type="primary"
          size="medium"
          extraClass="mb-20"
          disabled={isLoading || !password || !token}
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
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
