import React from 'react';
import { SortControls, type SortOption } from '../SortControls';
import styles from './GalleryControls.module.scss';

interface GalleryControlsProps {
  count: number;
  searchQuery: string;
  isLoading: boolean;
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  count,
  currentSort,
  onSortChange,
}) => {
  return (
    <div className={styles.controlsContainer}>
      <SortControls
        currentSort={currentSort}
        onSortChange={onSortChange}
        resultsCount={count}
      />
    </div>
  );
};
