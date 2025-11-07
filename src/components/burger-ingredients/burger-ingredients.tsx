import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TActiveTab = 'bun' | 'main' | 'sauce';

const activeTabLabels: Record<TActiveTab, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

  const [activeTab, setActiveTab] = useState<TActiveTab>('bun');
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  const filterIngredients = (type: TActiveTab): TIngredient[] => {
    return ingredients.filter((ingredient) => ingredient.type === type);
  };

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={`${styles.menu} mb-10 mt-5`}>
            <Tab
              value="bun"
              active={activeTab === 'bun'}
              onClick={() => setActiveTab('bun')}
            >
              Булки
            </Tab>
            <Tab
              value="main"
              active={activeTab === 'main'}
              onClick={() => setActiveTab('main')}
            >
              Начинки
            </Tab>
            <Tab
              value="sauce"
              active={activeTab === 'sauce'}
              onClick={() => setActiveTab('sauce')}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <p className="text text_type_main-medium">{activeTabLabels[activeTab]}</p>
        <div className={`${styles.burger_ingredients_list} pt-6 pb-10 pl-4 pr-4`}>
          {filterIngredients(activeTab).map((ingredient) => (
            <BurgerIngredientCard
              key={ingredient._id}
              ingredient={ingredient}
              onClick={() => setSelectedIngredient(ingredient)}
            />
          ))}
        </div>
      </section>
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setSelectedIngredient(null)}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
