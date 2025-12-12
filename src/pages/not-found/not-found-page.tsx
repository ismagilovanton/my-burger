import { MainLayout } from '@/layouts/main-layout/main-layout';
import { Link } from 'react-router-dom';

import type React from 'react';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <p className={`${styles.code} text text_type_digits-large`}>404</p>
        <p className="text text_type_main-medium mb-4">Страница не найдена</p>
        <p className="text text_type_main-default text_color_inactive mb-4">
          Кажется, вы попали на несуществующий маршрут.
        </p>
        <Link to="/" className="text text_type_main-default">
          Вернуться на главную
        </Link>
      </section>
    </MainLayout>
  );
};
