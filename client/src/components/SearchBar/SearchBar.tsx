import React, { type KeyboardEvent, useEffect, useRef, useCallback } from 'react';
import { useSearchBar } from './useSearchBar';
import { SearchHistory } from '../SearchHistory';
import { Spinner } from '../Loader';
import styles from './SearchBar.module.scss';
import { TEXTS } from '../../constants/texts';

interface SearchBarProps {
  onResults: (results: any[]) => void;
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
    setSearchQuery,
    results,
    isSearching,
    error,
    clearSearch,
  } = useSearchBar(debounceMs);

  const isInitialMount = useRef(true);
  const historyRef = useRef<{ actions: { toggleHistory: () => void, closeHistory: () => void, addToHistory: (query: string, resultsCount?: number, avgConfidence?: number) => void } }>(null);

  useEffect(() => {
    onResults(results);
    if (!isInitialMount.current && searchQuery.trim()) {
      // The history will be updated manually
    } else {
      isInitialMount.current = false;
    }
  }, [results, searchQuery]);

  useEffect(() => {
    onSearchQueryChange(searchQuery);
  }, [searchQuery, onSearchQueryChange]);

  const prevIsSearching = useRef(isSearching);

  useEffect(() => {
    onSearching(isSearching);
    if (prevIsSearching.current && !isSearching && searchQuery.trim()) {
      historyRef.current?.actions.addToHistory(searchQuery.trim(), results.length, averageConfidence);
    }
    prevIsSearching.current = isSearching;
  }, [isSearching, onSearching, searchQuery, results, averageConfidence]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Manually trigger a search to update history correctly.
      setSearchQuery(searchQuery);
      historyRef.current?.actions.closeHistory();
    } else if (event.key === 'Escape') {
      historyRef.current?.actions.closeHistory();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    clearSearch();
    historyRef.current?.actions.closeHistory();
  };

  const containerClasses = [
    styles.searchBarContainer,
    isSearching ? styles.searchingState : '',
    className,
  ].filter(Boolean).join(' ');

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
          
          <div className={styles.inputIcons}>
            {isSearching ? (
              <Spinner size="small" message="" className={styles.spinnerPlacement} />
            ) : (
              <button
                type="button"
                onClick={() => historyRef.current?.actions.toggleHistory()}
                className={`${styles.historyButton}`}
                aria-label="Search history"
              >
                🕘
              </button>
            )}
            
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={`${styles.clearButton} ${searchQuery ? styles.visible : ''}`}
                aria-label="Clear search"
              >
                ✖
              </button>
            )}
          </div>

          <SearchHistory onSelectQuery={handleHistorySelect} ref={historyRef} />
        </div>
        
        {error && <div className={styles.errorPill}>{error}</div>}

      </div>
    </div>
  );
};
