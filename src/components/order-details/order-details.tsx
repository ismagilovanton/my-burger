import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: string;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => {
  return (
    <div className={`${styles.order_details} mb-15 mt-15`}>
      <p className={`text text_type_digits-large mb-8 ${styles.glow_text}`}>
        {orderNumber}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`mb-15 ${styles.gif_wrap}`}>
        <img src="/done.gif" alt="Готово" className={styles.gif} />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
