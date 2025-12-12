import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { MainLayout } from '@/layouts/main-layout/main-layout';
import { fetchIngredients } from '@/services/ingredients/ingredientsSlice';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type React from 'react';

import styles from './ingredients-detail-page.module.css';

export const IngredientsDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.ingredients);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, status]);

  const ingredient = items.find((item) => item._id === id);

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <MainLayout>
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
    </MainLayout>
  );
};
