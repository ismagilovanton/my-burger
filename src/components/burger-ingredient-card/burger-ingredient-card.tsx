import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  ingredient: TIngredient;
  onClick?: () => void;
};

export const BurgerIngredientCard = ({
  ingredient,
  onClick,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  return (
    <div className={styles.card} onClick={onClick}>
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
