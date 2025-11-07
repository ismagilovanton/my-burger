import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  ingredient: TIngredient;
};

export const BurgerIngredientCard = ({
  ingredient,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  return (
    <div className={styles.card}>
      <div className={styles.counter}>
        <Counter count={1} size="default" extraClass="m-1" />
      </div>
      <img src={ingredient.image} alt={ingredient.name} />
      <div className={styles.price}>
        <p className="text text_type_digits-default">{ingredient.price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <span className={`${styles.name} mb-6`}>{ingredient.name}</span>
    </div>
  );
};

export default BurgerIngredientCard;
