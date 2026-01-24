import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export const OrderDetails = ({
  orderNumber,
  status,
}: TOrderDetailsProps): React.JSX.Element => {
  const isLoading = status === 'loading';

  return (
    <div className={`${styles.order_details} mb-15 mt-15`}>
      {isLoading ? (
        <p className={`text text_type_main-large mb-15 ${styles.glow_text}`}>
          Оформляем заказ...
        </p>
      ) : (
        <>
          <p className={`text text_type_digits-large mb-8 ${styles.glow_text}`}>
            {orderNumber}
          </p>
          <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
          <div className={`mb-15 ${styles.gif_wrap}`}>
            <img src="/done.gif" alt="Готово" className={styles.gif} />
          </div>
          <p className="text text_type_main-default mb-2">
            {isLoading ? 'Отправляем заказ на кухню' : 'Ваш заказ начали готовить'}
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Дождитесь готовности на орбитальной станции
          </p>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
