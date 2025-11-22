import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({
  title,
  onClose,
  children,
}: TModalProps): React.JSX.Element | null => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('modals');
  if (!modalRoot) return null;

  const stopClickPropagation: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
  };

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onClick={stopClickPropagation}
      >
        <div className={`${styles.header} pt-10 pl-10 pr-10`}>
          {title ? <h3 className="text text_type_main-large">{title}</h3> : <span />}
          <button
            className={styles.close}
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={`pb-15 pl-10 pr-10`}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
