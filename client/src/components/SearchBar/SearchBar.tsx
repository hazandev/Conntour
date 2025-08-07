import React, { type KeyboardEvent, useEffect, useRef } from 'react';
import { useSearch } from './useSearch';
import { useSearchHistory } from '../SearchHistory/useSearchHistory';
import { SearchHistoryDropdown } from '../SearchHistory/SearchHistoryDropdown';
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
  } = useSearch(debounceMs);

  const {
    history,
    paginatedHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isHistoryOpen,
    toggleHistory,
    closeHistory,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
  } = useSearchHistory();

  const isInitialMount = useRef(true);

  useEffect(() => {
    onResults(results);
    if (!isInitialMount.current && searchQuery.trim()) {
      addToHistory(searchQuery.trim(), results.length, averageConfidence);
    } else {
      isInitialMount.current = false;
    }
  }, [results, averageConfidence]);

  useEffect(() => {
    onSearchQueryChange(searchQuery);
  }, [searchQuery, onSearchQueryChange]);

  useEffect(() => {
    onSearching(isSearching);
  }, [isSearching, onSearching]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      closeHistory();
    } else if (event.key === 'Escape') {
      closeHistory();
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
    closeHistory();
  };

  const containerClasses = [
    styles.searchBarContainer,
    isSearching ? styles.searchingState : '',
    isHistoryOpen ? styles.historyOpen : '',
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
                onClick={toggleHistory}
                className={`${styles.historyButton} ${isHistoryOpen ? styles.active : ''}`}
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

          <SearchHistoryDropdown
            history={paginatedHistory}
            totalHistory={history}
            isOpen={isHistoryOpen}
            onClose={closeHistory}
            onSelectQuery={handleHistorySelect}
            onDeleteQuery={removeFromHistory}
            onClearAll={clearHistory}
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onGoToPage={goToPage}
          />
        </div>
        
        {error && <div className={styles.errorPill}>{error}</div>}

      </div>
    </div>
  );
};
