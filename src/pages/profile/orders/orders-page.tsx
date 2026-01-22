import { OrderCard } from '@/components/order-card/order-card';
import { Link, useLocation } from 'react-router-dom';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './orders-page.module.css';

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

const baseOrders: TMockOrder[] = [
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
    status: 'pending',
    ingredients: mockIngredients.slice(0, 3),
    price: 560,
  },
  {
    number: 345533,
    name: 'Black Hole Singularity острый бургер',
    createdAt: 'Вчера, 13:50',
    status: 'done',
    ingredients: mockIngredients,
    price: 510,
  },
  {
    number: 345532,
    name: 'Supernova Infinity бургер',
    createdAt: '2 дня назад, 21:53',
    status: 'done',
    ingredients: mockIngredients.slice(0, 2),
    price: 370,
  },
];

const mockOrders: TMockOrder[] = Array.from({ length: 12 }, (_, index) => {
  const base = baseOrders[index % baseOrders.length];
  return {
    ...base,
    number: base.number + index,
  };
});

export const ProfileOrdersPage = (): React.JSX.Element => {
  const location = useLocation();

  return (
    <section className={styles.page}>
      {mockOrders.map((order) => (
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
            statusText={order.status === 'done' ? 'Выполнен' : 'Готовится'}
          />
        </Link>
      ))}
    </section>
  );
};
