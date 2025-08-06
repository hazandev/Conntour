import React from 'react';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <a href="/" className={styles.logo}>
          Space Explorer <span>🚀</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
