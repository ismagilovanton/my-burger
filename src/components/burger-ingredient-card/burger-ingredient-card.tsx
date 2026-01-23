import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag, type DragSourceMonitor } from 'react-dnd';

import type { TIngredient } from '@/types/ingredient';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  ingredient: TIngredient;
  onClick?: () => void;
  count?: number;
};

export const BurgerIngredientCard = ({
  ingredient,
  onClick,
  count = 0,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'INGREDIENT',
    item: { ingredient },
    collect: (
      monitor: DragSourceMonitor<{ ingredient: TIngredient }, unknown>
    ): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        dragRef(node);
      }}
      className={styles.card}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" extraClass="m-1" />
        </div>
      )}
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
