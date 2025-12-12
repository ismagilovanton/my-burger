import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useScrollActiveTab } from '@/hooks/useScrollActiveTab';
import { fetchIngredients } from '@/services/ingredients/ingredientsSlice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items: ingredients,
    status,
    error,
  } = useAppSelector((state) => state.ingredients);

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

  const { containerRef, registerHeader, activeTab, setActiveTab } =
    useScrollActiveTab<TActiveTab>(sectionKeys, (key) =>
      Boolean(groupedIngredients[key]?.length)
    );

  const countsById = useAppSelector((state) => {
    const map = new Map<string, number>();
    const items = state.burgerConstructor.items;
    for (const it of items) {
      if (it.type === 'bun') continue;
      map.set(it._id, (map.get(it._id) ?? 0) + 1);
    }
    const bun = items.find((i) => i.type === 'bun');
    if (bun) {
      map.set(bun._id, 2);
    }
    return map;
  });

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
        <div className={styles.burger_ingredients_list} ref={containerRef}>
          {Object.entries(groupedIngredients).map(([sectionKey, items]) => (
            <React.Fragment key={sectionKey}>
              <p
                className="text text_type_main-medium"
                ref={registerHeader(sectionKey as TActiveTab)}
              >
                {activeTabLabels[sectionKey as TActiveTab] ?? sectionKey}
              </p>
              <div className={`${styles.burger_ingredients_grid} pt-6 pb-10 pl-4 pr-4`}>
                {items?.map((ingredient) => (
                  <BurgerIngredientCard
                    key={ingredient._id}
                    ingredient={ingredient}
                    count={countsById.get(ingredient._id) ?? 0}
                    onClick={() =>
                      navigate(`/ingredients/${ingredient._id}`, {
                        state: { backgroundLocation: location },
                      })
                    }
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  );
};
