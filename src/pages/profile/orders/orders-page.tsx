import { OrderCard } from '@/components/order-card/order-card';
import { PROFILE_WS_ACTIONS } from '@/constants/ws';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { TIngredient } from '@/types/ingredient';
import type { TOrder } from '@/types/order';
import type React from 'react';

import styles from './orders-page.module.css';

type TUiOrder = {
  number: number;
  name: string;
  createdAt: string;
  status: TOrder['status'];
  ingredients: TIngredient[];
  price: number;
};

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const orders = useAppSelector((state) => state.profileOrders.orders);

  useEffect(() => {
    dispatch({ type: PROFILE_WS_ACTIONS.INIT });

    return (): void => {
      dispatch({ type: PROFILE_WS_ACTIONS.CLOSE });
    };
  }, []);

  const ingredientsById = useMemo<Map<string, TIngredient>>(() => {
    const map = new Map<string, TIngredient>();
    allIngredients.forEach((ingredient) => {
      map.set(ingredient._id, ingredient);
    });
    return map;
  }, [allIngredients]);

  const uiOrders: TUiOrder[] = useMemo<TUiOrder[]>(() => {
    return orders.map((order: TOrder) => {
      const ingredients = order.ingredients
        .map((id) => ingredientsById.get(id))
        .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));

      const price = ingredients.reduce<number>(
        (sum, ingredient) => sum + ingredient.price,
        0
      );

      const createdAt = new Date(order.createdAt)
        .toLocaleString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })
        .toString();

      return {
        number: Number(order.number),
        name: order.name,
        createdAt,
        status: order.status,
        ingredients,
        price,
      };
    });
  }, [orders, ingredientsById]);

  const getStatusText = (status: TOrder['status']): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
      case 'created':
        return 'Готовится';
      default:
        return 'Отменён';
    }
  };

  return (
    <section className={styles.page}>
      {uiOrders.map((order) => (
        <Link
          key={order.number}
          to={`/profile/orders/${order.number}`}
          state={{ backgroundLocation: location }}
          className="text_color_primary"
        >
          <OrderCard
            number={order.number}
            name={order.name}
            createdAt={order.createdAt}
            price={order.price}
            ingredients={order.ingredients}
            statusText={getStatusText(order.status)}
          />
        </Link>
      ))}
    </section>
  );
};
