import { OrderCard } from '@/components/order-card/order-card';
import { FEED_WS_ACTIONS } from '@/constants/ws';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { TIngredient } from '@/types/ingredient';
import type { TOrder } from '@/types/order';

import styles from './feed-page.module.css';

type TUiOrder = {
  id: string;
  number: number;
  name: string;
  createdAt: string;
  status: TOrder['status'];
  ingredients: TIngredient[];
  price: number;
};

const chunkNumbers = (numbers: number[], chunkSize: number): number[][] => {
  const chunks: number[][] = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }
  return chunks;
};

type TStatusBlockProps = {
  title: string;
  columns: number[][];
  itemClassName: string;
};

const StatusBlock = ({
  title,
  columns,
  itemClassName,
}: TStatusBlockProps): React.JSX.Element => {
  return (
    <div className={styles.statusBlock}>
      <h2 className="text text_type_main-medium mb-4">{title}</h2>
      <div className={styles.statusLists}>
        {columns.slice(0, 2).map((column, columnIndex) => (
          <ul key={columnIndex} className={styles.statusList}>
            {column.map((num) => (
              <li key={num} className={itemClassName}>
                {num.toString().padStart(6, '0')}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

type TBigNumberBlockProps = {
  title: string;
  value: number;
};

const BigNumberBlock = ({ title, value }: TBigNumberBlockProps): React.JSX.Element => {
  return (
    <div className={styles.bigNumberBlock}>
      <h2 className="text text_type_main-medium mb-4">{title}</h2>
      <p className={`${styles.bigNumber} text text_type_digits-large`}>{value}</p>
    </div>
  );
};

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const location = useLocation();

  const { orders, total, totalToday } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch({ type: FEED_WS_ACTIONS.INIT });

    return (): void => {
      dispatch({ type: FEED_WS_ACTIONS.CLOSE });
    };
  }, [dispatch]);

  const ingredientsById = useMemo<Map<string, TIngredient>>(() => {
    const map = new Map<string, TIngredient>();
    allIngredients.forEach((ingredient) => {
      map.set(ingredient._id, ingredient);
    });
    return map;
  }, [allIngredients]);

  const uiOrders: TUiOrder[] = useMemo<TUiOrder[]>((): TUiOrder[] => {
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
        id: order._id,
        number: Number(order.number),
        name: order.name,
        createdAt,
        status: order.status,
        ingredients,
        price,
      };
    });
  }, [orders, ingredientsById]);

  const doneNumbers = uiOrders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);

  const pendingNumbers = uiOrders
    .filter((order) => order.status !== 'done')
    .map((order) => order.number);

  const doneColumns = chunkNumbers(doneNumbers, 10);
  const pendingColumns = chunkNumbers(pendingNumbers, 10);

  return (
    <section className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large mb-5`}>Лента заказов</h1>

      <div className={styles.ordersColumn}>
        {uiOrders.map((order) => (
          <Link
            key={order.id}
            to={`/feed/${order.number}`}
            state={{ backgroundLocation: location }}
            className="text_color_primary"
          >
            <OrderCard
              number={order.number}
              name={order.name}
              createdAt={order.createdAt}
              price={order.price}
              ingredients={order.ingredients}
              statusText={order.status === 'done' ? 'Выполнен' : 'Готовится'}
            />
          </Link>
        ))}
      </div>

      <aside className={styles.statsColumn}>
        <div className={styles.statusBlocks}>
          <StatusBlock
            title="Готовы:"
            columns={doneColumns}
            itemClassName={`${styles.statusReady} text text_type_digits-default`}
          />
          <StatusBlock
            title="В работе:"
            columns={pendingColumns}
            itemClassName={`${styles.statusInProgress} text text_type_digits-default`}
          />
        </div>

        <BigNumberBlock title="Выполнено за все время:" value={total} />
        <BigNumberBlock title="Выполнено за сегодня:" value={totalToday} />
      </aside>
    </section>
  );
};
