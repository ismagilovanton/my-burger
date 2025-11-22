import { removeBurgerConstructorItem } from '@/features/burger-constructor/burgerConstructorSlice';
import { createOrder } from '@/features/order/orderSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const burgerConstructorItems = useAppSelector(
    (state) => state.burgerConstructor.items
  );
  const orderNumber: string = useAppSelector(
    (state) => state.order.order?.orderNumber ?? '-----'
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  const bun: TIngredient | undefined = useMemo(
    () => burgerConstructorItems.find((item) => item.type === 'bun'),
    [burgerConstructorItems]
  );
  const currentFillings: TIngredient[] = useMemo(
    () => burgerConstructorItems.filter((item) => item.type !== 'bun'),
    [burgerConstructorItems]
  );

  const handleRemoveFilling = (id: string): void => {
    dispatch(removeBurgerConstructorItem(id));
  };

  const handleCreateOrder = (): void => {
    const ingredientIds: string[] = burgerConstructorItems.map((i) => i._id);
    void dispatch(createOrder(ingredientIds));
    setIsOrderModalOpen(true);
  };

  return (
    <section className={`${styles.burger_constructor} mt-5 mb-12`}>
      <div className={`${styles.constructor_elements} `}>
        {JSON.stringify(burgerConstructorItems)}
        {bun && (
          <div className={`${styles.constructor_element} pl-4 pr-4`}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}

        <div className={styles.constructor_fillings}>
          {currentFillings.map((ingredient: TIngredient) => (
            <div
              className={`${styles.constructor_element} pl-4 pr-4`}
              key={ingredient._id}
            >
              <DragIcon type="primary" />
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
                handleClose={() => handleRemoveFilling(ingredient._id)}
              />
            </div>
          ))}
        </div>

        {bun && (
          <div className={`${styles.constructor_element} pl-4 pr-4`}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}
      </div>
      <div className={`${styles.price_container} mb-15 pr-4 pl-4`}>
        <div className={`${styles.price} mr-10`}>
          <p className="text text_type_digits-medium">1000</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleCreateOrder}
        >
          Оформить заказ
        </Button>
      </div>
      {isOrderModalOpen && (
        <Modal onClose={() => setIsOrderModalOpen(false)}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};
