import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './order-detail.module.css';

export type TOrderDetailIngredient = TIngredient & { count: number };

type TOrderDetailProps = {
  orderNumber: string;
  name: string;
  statusText: string;
  createdAt: string;
  ingredients: TOrderDetailIngredient[];
};

type TOrderDetailIngredientRowProps = {
  ingredient: TOrderDetailIngredient;
};

const OrderDetailIngredientRow = ({
  ingredient,
}: TOrderDetailIngredientRowProps): React.JSX.Element => {
  return (
    <li className={styles.ingredientRow}>
      <div className={styles.ingredientInfo}>
        <div className={styles.ingredientAvatar}>
          <img
            src={ingredient.image}
            alt={ingredient.name}
            className={styles.ingredientImage}
          />
        </div>
        <p className="text text_type_main-default">{ingredient.name}</p>
      </div>

      <div className={styles.ingredientPrice}>
        <p className="text text_type_digits-default mr-2">
          {ingredient.count} x {ingredient.price}
        </p>
        <CurrencyIcon type="primary" />
      </div>
    </li>
  );
};

export const OrderDetail = ({
  orderNumber,
  name,
  statusText,
  createdAt,
  ingredients,
}: TOrderDetailProps): React.JSX.Element => {
  const totalPrice = ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price * ingredient.count,
    0
  );

  return (
    <section className={styles.page}>
      <article className={styles.card}>
        <p className={`${styles.number} text text_type_digits-default mb-10`}>
          #{orderNumber}
        </p>
        <h1 className="text text_type_main-medium mb-3">{name}</h1>
        <p className={`${styles.status} text text_type_main-default mb-15`}>
          {statusText}
        </p>

        <h2 className="text text_type_main-medium mb-6">Состав:</h2>
        <ul className={styles.ingredients}>
          {ingredients.map((ingredient) => (
            <OrderDetailIngredientRow key={ingredient._id} ingredient={ingredient} />
          ))}
        </ul>

        <footer className={styles.footer}>
          <p className="text text_type_main-default text_color_inactive">{createdAt}</p>
          <div className={styles.totalPrice}>
            <p className="text text_type_digits-default mr-2">{totalPrice}</p>
            <CurrencyIcon type="primary" />
          </div>
        </footer>
      </article>
    </section>
  );
};
