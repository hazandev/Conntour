import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Layout.module.scss';
import type { LayoutProps } from './types';
import Header from './Header';
import Footer from './Footer';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.page}>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
