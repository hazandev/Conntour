import React from 'react';
import styles from './SortControls.module.scss';

export type SortOption = 'confidence-desc' | 'confidence-asc';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
  resultsCount: number;
}

const sortOptions: { value: SortOption; label: string; icon: string }[] = [
  { value: 'confidence-desc', label: 'Highest Confidence', icon: '⭐' },
  { value: 'confidence-asc', label: 'Lowest Confidence', icon: '🔻' },
];

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange, resultsCount }) => {
  if (resultsCount === 0) {
    return null;
  }

  return (
    <div className={styles.sortContainer}>
      <span className={styles.resultsCount}>{resultsCount} results</span>
      <div className={styles.selectWrapper}>
      <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={styles.sortSelect}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
