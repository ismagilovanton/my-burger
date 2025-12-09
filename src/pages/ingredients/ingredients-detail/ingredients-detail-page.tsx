import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useAppSelector } from '@/hooks/redux';
import { MainLayout } from '@/layouts/main-layout/main-layout';
import { useParams } from 'react-router-dom';

import type React from 'react';

import styles from './ingredients-detail-page.module.css';

export const IngredientsDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredient = useAppSelector((state) =>
    state.ingredients.items.find((item) => item._id === id)
  );

  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className="text text_type_main-large mb-10">Детали ингредиента</h1>
        {ingredient ? (
          <IngredientDetails ingredient={ingredient} />
        ) : (
          <p className="text text_type_main-default text_color_inactive">
            Идет загрузка ингредиента...
          </p>
        )}
      </section>
    </MainLayout>
  );
};
