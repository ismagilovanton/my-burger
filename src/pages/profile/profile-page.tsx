import { MainLayout } from '@/layouts/main-layout/main-layout';
import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
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
          <form className={styles.form}>
            <Input
              type="text"
              placeholder="Имя"
              extraClass="mb-6"
              value=""
              onChange={() => undefined}
            />
            <Input
              type="email"
              placeholder="Логин"
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
          </form>
        </div>
      </section>
    </MainLayout>
  );
};
