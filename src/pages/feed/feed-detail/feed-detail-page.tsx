import {
  OrderDetail,
  type TOrderDetailIngredient,
} from '@/components/order-detail/order-detail';
import { useParams } from 'react-router-dom';

import type React from 'react';

type TIngredientWithCount = TOrderDetailIngredient;

const mockIngredients: TIngredientWithCount[] = [
  {
    _id: '1',
    name: 'Флуоресцентная булка R2-D3',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 20,
    image: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0,
    count: 2,
  },
  {
    _id: '2',
    name: 'Филе Люминесцентного тетраодонтиформа',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0,
    count: 1,
  },
  {
    _id: '3',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 30,
    image: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
    __v: 0,
    count: 1,
  },
  {
    _id: '4',
    name: 'Плоды фалленианского дерева',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
    __v: 0,
    count: 1,
  },
];

export const FeedDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const orderNumber = (id ?? '034533').toString().padStart(6, '0');

  return (
    <OrderDetail
      orderNumber={orderNumber}
      name="Black Hole Singularity острый бургер"
      statusText="Выполнен"
      createdAt="Вчера, 13:50"
      ingredients={mockIngredients}
    />
  );
};
