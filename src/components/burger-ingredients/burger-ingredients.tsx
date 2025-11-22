import {
  setCurrentIngredient,
  clearCurrentIngredient,
} from '@/features/current-ingredient/currentIngredientSlice';
import { fetchIngredients } from '@/features/ingredients/ingredientsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import React, { useEffect, useMemo } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TActiveTab = 'bun' | 'main' | 'sauce';

const activeTabLabels: Record<TActiveTab, string> = {
  bun: 'Булки',
  main: 'Начинки',
  sauce: 'Соусы',
};

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const {
    items: ingredients,
    status,
    error,
  } = useAppSelector((state) => state.ingredients);

  const currentIngredient = useAppSelector((state) => state.currentIngredient.current);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, status]);

  const sectionKeys: readonly TActiveTab[] = ['bun', 'main', 'sauce'] as const;

  const groupedIngredients = useMemo(() => {
    return ingredients.reduce(
      (acc, ingredient) => {
        const key = ingredient.type as TActiveTab;
        (acc[key] ??= []).push(ingredient);
        return acc;
      },
      {} as Partial<Record<TActiveTab, TIngredient[]>>
    );
  }, [ingredients]);

  return (
    <>
      <section className={styles.burger_ingredients}>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && <div>Error: {error}</div>}
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
        <div className={styles.burger_ingredients_list}>
          {Object.entries(groupedIngredients).map(([sectionKey, items]) => (
            <React.Fragment key={sectionKey}>
              <p className="text text_type_main-medium">
                {activeTabLabels[sectionKey as TActiveTab] ?? sectionKey}
              </p>
              <div className={`${styles.burger_ingredients_grid} pt-6 pb-10 pl-4 pr-4`}>
                {items?.map((ingredient) => (
                  <BurgerIngredientCard
                    key={ingredient._id}
                    ingredient={ingredient}
                    onClick={() => dispatch(setCurrentIngredient(ingredient))}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
      {currentIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(clearCurrentIngredient())}
        >
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
    </>
  );
};
