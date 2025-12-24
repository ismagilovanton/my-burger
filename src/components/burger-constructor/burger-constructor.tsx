import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  addBurgerConstructorItem,
  clearBurgerConstructor,
  moveBurgerConstructorItem,
  removeBurgerConstructorItem,
  type TBurgerConstructorItem,
} from '@/services/burger-constructor/burgerConstructorSlice';
import { clearOrder, createOrder } from '@/services/order/orderSlice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const burgerConstructorItems = useAppSelector(
    (state) => state.burgerConstructor.items
  );
  const orderNumber: string = useAppSelector(
    (state) => state.order.order?.orderNumber ?? '-----'
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.auth);

  const [, dropRef] = useDrop<{ ingredient: TIngredient }, void, unknown>(() => ({
    accept: 'INGREDIENT',
    drop: (item: { ingredient: TIngredient }): void => {
      const ingredient = item.ingredient;
      dispatch(addBurgerConstructorItem(ingredient));
    },
  }));

  const bun: TBurgerConstructorItem | undefined = useMemo(
    () => burgerConstructorItems.find((item) => item.type === 'bun'),
    [burgerConstructorItems]
  );
  const currentFillings: TBurgerConstructorItem[] = useMemo(
    () => burgerConstructorItems.filter((item) => item.type !== 'bun'),
    [burgerConstructorItems]
  );

  const handleMoveFilling = (fromIndex: number, toIndex: number): void => {
    dispatch(moveBurgerConstructorItem({ fromIndex, toIndex }));
  };

  const handleRemoveFilling = (uniqueId: string): void => {
    dispatch(removeBurgerConstructorItem(uniqueId));
  };

  const handleCreateOrder = (): void => {
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds: string[] = burgerConstructorItems.map((i) => i._id);
    void dispatch(createOrder(ingredientIds));
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
    dispatch(clearBurgerConstructor());
    dispatch(clearOrder());
  };

  const totalPrice: number = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      currentFillings.reduce((sum: number, ingredient: TIngredient) => {
        return sum + ingredient.price;
      }, 0),
    [bun, currentFillings]
  );

  return (
    <section
      className={`${styles.burger_constructor} mt-5 mb-12`}
      ref={(node) => {
        dropRef(node);
      }}
    >
      <div className={`${styles.constructor_elements} `}>
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
          {currentFillings.map((ingredient) => {
            const index = burgerConstructorItems.indexOf(ingredient);
            return (
              <ConstructorFilling
                key={ingredient.uniqueId}
                ingredient={ingredient}
                index={index}
                onMove={handleMoveFilling}
                onRemove={handleRemoveFilling}
              />
            );
          })}
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
          <p className="text text_type_digits-medium">{totalPrice}</p>
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
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};

type TConstructorFillingProps = {
  ingredient: TBurgerConstructorItem;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (uniqueId: string) => void;
};

type TDragItem = {
  index: number;
  type: 'CONSTRUCTOR_INGREDIENT';
};

const ConstructorFilling = ({
  ingredient,
  index,
  onMove,
  onRemove,
}: TConstructorFillingProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, dropRef] = useDrop<TDragItem>({
    accept: 'CONSTRUCTOR_INGREDIENT',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef] = useDrag<TDragItem, void, { isDragging: boolean }>({
    type: 'CONSTRUCTOR_INGREDIENT',
    item: { index, type: 'CONSTRUCTOR_INGREDIENT' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(dropRef(ref));

  const opacity = isDragging ? 0.3 : 1;

  return (
    <div
      ref={ref}
      className={`${styles.constructor_element} pl-4 pr-4`}
      style={{ opacity }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.uniqueId)}
      />
    </div>
  );
};
