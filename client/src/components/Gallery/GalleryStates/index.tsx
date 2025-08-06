import React from 'react';
import { Spinner } from '../../Loader';
import styles from './GalleryStates.module.scss';

interface GalleryStatesProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  searchQuery?: string;
}

const getLoadingMessage = (query?: string) =>
  query ? `Searching images: "${query}"...` : 'Loading space images...';

const getErrorContent = (query?: string) => ({
  title: 'Failed to load images',
  message: query
    ? `Problem searching for "${query}". Try different keywords or refresh the page`
    : 'Please refresh the page or try again later',
});

const getEmptyContent = (query?: string) => ({
  title: query ? `No images found for "${query}"` : 'No images found',
  message: query
    ? 'Try searching with different keywords or another topic'
    : 'Try searching for something interesting!',
});

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <div className={styles.error}>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <div className={styles.empty}>
    <span className={styles.emptyIcon}>🔍</span>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

export const GalleryStates: React.FC<GalleryStatesProps> = ({
  isLoading,
  isError,
  isEmpty,
  searchQuery = '',
}) => {
  if (isLoading) return <Spinner message={getLoadingMessage(searchQuery)} />;

  if (isError) {
    const { title, message } = getErrorContent(searchQuery);
    return <ErrorState title={title} message={message} />;
  }

  if (isEmpty) {
    const { title, message } = getEmptyContent(searchQuery);
    return <EmptyState title={title} message={message} />;
  }

  return null;
};
