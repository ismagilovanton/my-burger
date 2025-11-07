import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

const ingredientLabels: Record<string, string> = {
  calories: 'Калории, ккал',
  proteins: 'Белки, г',
  fat: 'Жиры, г',
  carbohydrates: 'Углеводы, г',
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const ingredientClassname = 'text text_type_main-default text_color_inactive';

  return (
    <div className={styles.wrapper}>
      <img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />
      <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>
      <div className={`text text_type_main-default ${styles.stats}`}>
        <div className={styles.stats_item}>
          <p className={ingredientClassname}>{ingredientLabels.calories}</p>
          <p className={ingredientClassname}>{ingredient.calories}</p>
        </div>
        <div className={styles.stats_item}>
          <p className={ingredientClassname}>{ingredientLabels.proteins}</p>
          <p className={ingredientClassname}>{ingredient.proteins}</p>
        </div>
        <div className={styles.stats_item}>
          <p className={ingredientClassname}>{ingredientLabels.fat}</p>
          <p className={ingredientClassname}>{ingredient.fat}</p>
        </div>
        <div className={styles.stats_item}>
          <p className={ingredientClassname}>{ingredientLabels.carbohydrates}</p>
          <p className={ingredientClassname}>{ingredient.carbohydrates}</p>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
