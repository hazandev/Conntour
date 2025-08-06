import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  percentage: number;
  color: string;
  size: 'small' | 'medium' | 'large';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color, size }) => {
  return (
    <div className={`${styles.progressContainer} ${styles[size]}`}>
      <div
        className={`${styles.progressBar} ${styles[color]}`}
        style={{ width: `${percentage}%` }}
      />
      <div className={styles.progressBackground} />
    </div>
  );
};
