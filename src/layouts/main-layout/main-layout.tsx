import { AppHeader } from '@/components/app-header/app-header';

import styles from './main-layout.module.css';

export const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>{children}</main>
    </div>
  );
};
