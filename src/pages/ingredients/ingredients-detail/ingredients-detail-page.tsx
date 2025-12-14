import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useAppSelector } from '@/hooks/redux';
import { useParams } from 'react-router-dom';

import type React from 'react';

import styles from './ingredients-detail-page.module.css';

export const IngredientsDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { items, status, error } = useAppSelector((state) => state.ingredients);

  const ingredient = items.find((item) => item._id === id);

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <section className={styles.page}>
      <h1 className="text text_type_main-large mb-10">Детали ингредиента</h1>
      {isLoading && (
        <p className="text text_type_main-default text_color_inactive">
          Идёт загрузка ингредиента...
        </p>
      )}
      {!isLoading && error && (
        <p className="text text_type_main-default text_color_error">
          Ошибка загрузки ингредиента: {error}
        </p>
      )}
      {!isLoading && !error && ingredient && (
        <IngredientDetails ingredient={ingredient} />
      )}
      {!isLoading && !error && !ingredient && (
        <p className="text text_type_main-default text_color_inactive">
          Ингредиент не найден
        </p>
      )}
    </section>
  );
};
