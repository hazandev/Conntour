import React from 'react';
import { Spinner } from '../../Loader';
import styles from './SearchBarActions.module.scss';

interface SearchBarActionsProps {
  isSearching: boolean;
  searchQuery: string;
  onToggleHistory: () => void;
  onClearSearch: () => void;
}

export const SearchBarActions: React.FC<SearchBarActionsProps> = ({
  isSearching,
  searchQuery,
  onToggleHistory,
  onClearSearch,
}) => {
  return (
    <div className={styles.inputIcons}>
      {isSearching ? (
        <Spinner size="small" message="" className={styles.spinnerPlacement} />
      ) : (
        <button
          type="button"
          onClick={onToggleHistory}
          className={styles.historyButton}
          aria-label="Search history"
        >
          🕘
        </button>
      )}

      {searchQuery && (
        <button
          type="button"
          onClick={onClearSearch}
          className={`${styles.clearButton} ${searchQuery ? styles.visible : ''}`}
          aria-label="Clear search"
        >
          ✖
        </button>
      )}
    </div>
  );
};

