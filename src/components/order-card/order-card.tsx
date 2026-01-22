import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './order-card.module.css';

type TOrderCardProps = {
  number: number;
  name: string;
  createdAt: string;
  price: number;
  ingredients: TIngredient[];
  statusText?: string;
};

export const OrderCard = ({
  number,
  name,
  createdAt,
  price,
  ingredients,
  statusText,
}: TOrderCardProps): React.JSX.Element => {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <p className={`${styles.number} text text_type_digits-default`}>
          #{number.toString().padStart(6, '0')}
        </p>
        <p className={`${styles.time} text text_type_main-default`}>{createdAt}</p>
      </header>

      <h2 className={`${styles.title} text text_type_main-medium`}>{name}</h2>
      {statusText && (
        <p className={`${styles.status} text text_type_main-default`}>{statusText}</p>
      )}

      <footer className={styles.footer}>
        <div className={styles.ingredients}>
          {ingredients.slice(0, 5).map((ingredient, index) => {
            const isLastVisible = index === 4 && ingredients.length > 5;

            if (isLastVisible) {
              const restCount = ingredients.length - 4;
              return (
                <div
                  key={ingredient._id}
                  className={`${styles.ingredientAvatar} ${styles.ingredientMore}`}
                >
                  <span className="text text_type_main-default">+{restCount}</span>
                </div>
              );
            }

            return (
              <div key={ingredient._id} className={styles.ingredientAvatar}>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className={styles.ingredientImage}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.price}>
          <p className="text text_type_digits-default">{price}</p>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </article>
  );
};
