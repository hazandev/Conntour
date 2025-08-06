import React from 'react';
import styles from './SearchResultsCount.module.scss';
import { Spinner } from '../Loader';

interface SearchResultsCountProps {
  count: number;
  searchQuery: string;
  isLoading: boolean;
}

export const SearchResultsCount: React.FC<SearchResultsCountProps> = ({ count, searchQuery, isLoading }) => {
  if (isLoading) {
    return <Spinner size="small" message={`Searching for "${searchQuery}"...`} />;
  }

  return (
    <div className={styles.resultsCount}>
      <span className={styles.number}>{count}</span>
      <span className={styles.text}>results found for "{searchQuery}"</span>
    </div>
  );
};
