import { OrderCard } from '@/components/order-card/order-card';
import { Link, useLocation } from 'react-router-dom';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './feed-page.module.css';

type TMockOrder = {
  number: number;
  name: string;
  createdAt: string;
  status: 'done' | 'pending';
  ingredients: TIngredient[];
  price: number;
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Space Sauce',
    type: 'sauce',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    __v: 0,
  },
  {
    _id: '2',
    name: 'Lunar Bun',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 120,
    image: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  },
  {
    _id: '3',
    name: 'Nebula Filling',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 60,
    image: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0,
  },
  {
    _id: '4',
    name: 'Cosmic Cheese',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 40,
    image: 'https://code.s3.yandex.net/react/code/cheese-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/cheese-large.png',
    __v: 0,
  },
];

const mockOrders: TMockOrder[] = [
  {
    number: 345535,
    name: 'Death Star Starship Main бургер',
    createdAt: 'Сегодня, 16:20',
    status: 'done',
    ingredients: mockIngredients,
    price: 480,
  },
  {
    number: 345534,
    name: 'Interstellar бургер',
    createdAt: 'Сегодня, 13:20',
    status: 'done',
    ingredients: mockIngredients.slice(0, 3),
    price: 560,
  },
  {
    number: 345533,
    name: 'Black Hole Singularity острый бургер',
    createdAt: 'Вчера, 13:50',
    status: 'pending',
    ingredients: mockIngredients,
    price: 510,
  },
  {
    number: 345532,
    name: 'Supernova Infinity бургер',
    createdAt: '2 дня назад, 21:53',
    status: 'pending',
    ingredients: mockIngredients.slice(0, 2),
    price: 370,
  },
];

const baseDoneNumbers = mockOrders
  .filter((order) => order.status === 'done')
  .map((order) => order.number);

const basePendingNumbers = mockOrders
  .filter((order) => order.status === 'pending')
  .map((order) => order.number);

const mockDoneNumbers = Array.from({ length: 15 }, (_, index) => {
  const base = baseDoneNumbers[index % baseDoneNumbers.length];
  return base + index;
});

const mockPendingNumbers = Array.from({ length: 15 }, (_, index) => {
  const base = basePendingNumbers[index % basePendingNumbers.length];
  return base + index;
});

const chunkNumbers = (numbers: number[], chunkSize: number): number[][] => {
  const chunks: number[][] = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }
  return chunks;
};

const doneColumns = chunkNumbers(mockDoneNumbers, 10);
const pendingColumns = chunkNumbers(mockPendingNumbers, 10);

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
        {columns.map((column, columnIndex) => (
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
  const location = useLocation();

  return (
    <section className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large mb-5`}>Лента заказов</h1>

      <div className={styles.ordersColumn}>
        {mockOrders.map((order) => (
          <Link
            key={order.number}
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

        <BigNumberBlock title="Выполнено за все время:" value={28752} />
        <BigNumberBlock title="Выполнено за сегодня:" value={138} />
      </aside>
    </section>
  );
};
