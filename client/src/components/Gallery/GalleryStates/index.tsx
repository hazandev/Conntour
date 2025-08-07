import React from 'react';
import { Spinner } from '../../Loader';
import styles from './GalleryStates.module.scss';
import { TEXTS, formatText } from '../../../constants/texts';

interface GalleryStatesProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  searchQuery?: string;
}

const getLoadingMessage = (query?: string) =>
  query ? formatText(TEXTS.LOADING.SEARCHING, { query }) : TEXTS.LOADING.INITIAL_LOAD;

const getErrorContent = (query?: string) => ({
  title: TEXTS.ERROR_STATES.LOAD_FAILED,
  message: query
    ? formatText(TEXTS.ERROR_STATES.SEARCH_FAILED, { query })
    : TEXTS.ERROR_STATES.GENERAL_ERROR,
});

const getEmptyContent = (query?: string) => ({
  title: query ? formatText(TEXTS.EMPTY_STATES.NO_SEARCH_RESULTS, { query }) : TEXTS.EMPTY_STATES.NO_IMAGES_FOUND,
  message: query
    ? TEXTS.EMPTY_STATES.NO_SEARCH_RESULTS_MESSAGE
    : TEXTS.EMPTY_STATES.NO_IMAGES_MESSAGE,
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
