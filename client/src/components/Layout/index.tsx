import React from 'react';
import styles from './Layout.module.scss';
import type { LayoutProps } from './types';
import Header from './Header';
import Footer from './Footer';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <Header />
      <main className={`${styles.main} ${styles.container}`}>
        <section className={styles.section}>
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
