import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  return (
    <section className={`${styles.burger_constructor} mt-5 mb-12`}>
      <div className={`${styles.constructor_elements} pl-4 pr-4`}>
        {ingredients.map((ingredient, index) => (
          <div className={styles.constructor_element} key={ingredient._id}>
            <DragIcon type="primary" />
            <ConstructorElement
              type={
                index === 0
                  ? 'top'
                  : index === ingredients.length - 1
                    ? 'bottom'
                    : undefined
              }
              key={ingredient._id}
              isLocked={true}
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </div>
        ))}
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
          onClick={() => setIsOrderModalOpen(true)}
        >
          Оформить заказ
        </Button>
      </div>
      {isOrderModalOpen && (
        <Modal onClose={() => setIsOrderModalOpen(false)}>
          <OrderDetails orderNumber="034536" />
        </Modal>
      )}
    </section>
  );
};
