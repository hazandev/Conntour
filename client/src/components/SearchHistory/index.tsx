import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useSearchHistory } from './useSearchHistory';
import type { SearchHistoryProps, SearchHistoryItem } from './types';
import styles from './style.module.scss';

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export const SearchHistory = forwardRef<any, SearchHistoryProps>(({ onSelectQuery }, ref) => {
  const {
    history,
    paginatedHistory,
    isHistoryOpen,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    actions,
  } = useSearchHistory();

  useImperativeHandle(ref, () => ({
    actions: {
      toggleHistory: actions.toggleHistory,
      closeHistory: actions.closeHistory,
      addToHistory: actions.addToHistory,
    }
  }));

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        actions.closeHistory();
      }
    };

    if (isHistoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isHistoryOpen, actions]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        actions.closeHistory();
      }
    };

    if (isHistoryOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isHistoryOpen, actions]);

  if (!isHistoryOpen) return null;

  const handleQueryClick = (query: string) => {
    onSelectQuery(query);
    actions.closeHistory();
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    actions.removeFromHistory(id);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.clearHistory();
    actions.closeHistory();
  };

  return (
    <div className={styles.historyDropdown} ref={dropdownRef}>
      <div className={styles.historyHeader}>
        <span className={styles.historyTitle}>
          Recent Searches
          {history.length > 0 && (
            <span className={styles.historyCount}>({history.length})</span>
          )}
        </span>
        {history.length > 0 && (
          <button
            type="button"
            className={styles.clearAllButton}
            onClick={handleClearAll}
            aria-label="Clear all search history"
          >
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyHistory}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>No recent searches</p>
          <small>Your search history will appear here</small>
        </div>
      ) : (
        <>
          <div className={styles.historyList}>
            {paginatedHistory.map((item: SearchHistoryItem) => (
              <div
                key={item.id}
                className={styles.historyItem}
                onClick={() => handleQueryClick(item.query)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleQueryClick(item.query);
                  }
                }}
              >
                <div className={styles.historyItemContent}>
                  <div className={styles.historyQueryLine}>
                    <span className={styles.historyQuery}>{item.query}</span>
                    {item.resultsCount !== undefined && (
                      <span className={styles.historyResultsCount}>
                        {item.resultsCount.toLocaleString()} results
                      </span>
                    )}
                  </div>
                  <div className={styles.historyMetaLine}>
                    <span className={styles.historyTime}>
                      {formatTimestamp(item.timestamp)}
                    </span>
                    {item.confidence !== undefined && (
                      <span className={styles.historyConfidence}>
                        {Math.round(item.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.deleteHistoryButton}
                  onClick={(e) => handleDeleteClick(e, item.id)}
                  aria-label={`Delete search: ${item.query}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  className={`${styles.paginationButton} ${!hasPrevPage ? styles.disabled : ''}`}
                  onClick={actions.prevPage}
                  disabled={!hasPrevPage}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                
                <div className={styles.paginationInfo}>
                  <span className={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button
                  type="button"
                  className={`${styles.paginationButton} ${!hasNextPage ? styles.disabled : ''}`}
                  onClick={actions.nextPage}
                  disabled={!hasNextPage}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className={styles.historyFooter}>
        <small>Search history is stored locally on your device</small>
      </div>
    </div>
  );
});
