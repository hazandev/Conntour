import React from 'react';
import styles from './ConfidenceIndicator.module.scss';
import { ProgressBar } from '../ProgressBar';

interface ConfidenceIndicatorProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  size = 'medium',
  showLabel = true,
  className = ''
}) => {
  const normalizedScore = Math.max(0, Math.min(1, score));
  const percentage = Math.round(normalizedScore * 100);
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'high' };
    if (score >= 0.6) return { level: 'Medium', color: 'medium' };
    if (score >= 0.4) return { level: 'Low', color: 'low' };
    return { level: 'Very Low', color: 'very-low' };
  };

  const confidence = getConfidenceLevel(normalizedScore);
  
  return (
    <div className={`${styles.confidenceIndicator} ${styles[size]} ${className}`}>
      <ProgressBar percentage={percentage} color={confidence.color} size={size} />
      
      {showLabel && (
        <div className={styles.labelContainer}>
          <span className={`${styles.scoreText} ${styles[confidence.color]}`}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};
