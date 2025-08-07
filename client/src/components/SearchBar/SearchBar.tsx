import React from 'react';
import { useSearchBar } from './useSearchBar';
import { SearchHistory } from '../SearchHistory';
import styles from './SearchBar.module.scss';
import { TEXTS } from '../../constants/texts';
import type { ImageItem } from '../../types/ImageItem';
import { SearchBarActions } from './SearchBarActions';

interface SearchBarProps {
  onResults: (results: ImageItem[]) => void;
  onSearchQueryChange: (query: string) => void;
  onSearching: (isSearching: boolean) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  averageConfidence?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onResults,
  onSearchQueryChange,
  onSearching,
  placeholder = TEXTS.SEARCH.PLACEHOLDER,
  debounceMs = 500,
  className = '',
  averageConfidence,
}) => {
  const {
    searchQuery,
    isSearching,
    historyRef,
    containerClasses,
    handleInputChange,
    handleKeyPress,
    handleHistorySelect,
    handleClearSearch,
    toggleHistory,
  } = useSearchBar({
    onResults,
    onSearchQueryChange,
    onSearching,
    debounceMs,
    averageConfidence,
    className,
  });

  return (
    <div className={containerClasses}>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchInputContainer}>
          <input
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className={styles.searchInput}
            autoComplete="off"
            spellCheck="false"
            aria-label="Search NASA images"
            disabled={isSearching}
          />
          
          <span className={styles.telescopeIcon} aria-hidden="true">
            🔭
          </span>
          
          <SearchBarActions
            isSearching={isSearching}
            searchQuery={searchQuery}
            onToggleHistory={toggleHistory}
            onClearSearch={handleClearSearch}
          />

          <SearchHistory onSelectQuery={handleHistorySelect} ref={historyRef} />
        </div>
      </div>
    </div>
  );
};
