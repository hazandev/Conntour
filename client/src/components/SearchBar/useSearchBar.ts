import { useState, useCallback, useRef, useEffect, useMemo, type KeyboardEvent } from 'react';
import { toast } from 'react-toastify';
import type { ImageItem } from '../../types/ImageItem';
import { post } from '../../utils/fetchClient';
import { TEXTS } from '../../constants/texts';
import type { SearchHistoryHandle, UseSearchBarProps } from './types';
import styles from './SearchBar.module.scss';

interface UseSearchBarReturn {
  searchQuery: string;
  results: ImageItem[];
  isSearching: boolean;
  historyRef: React.RefObject<SearchHistoryHandle>;
  containerClasses: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleHistorySelect: (query: string) => void;
  handleClearSearch: () => void;
  toggleHistory: () => void;
}

export const useSearchBar = ({
  debounceMs = 500,
  onResults,
  onSearchQueryChange,
  onSearching,
  averageConfidence,
  className = '',
}: UseSearchBarProps): UseSearchBarReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<ImageItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestCountRef = useRef(0);
  const isInitialMount = useRef(true);
  const historyRef = useRef<SearchHistoryHandle>(null);

  const containerClasses = useMemo(() => [
    styles.searchBarContainer,
    isSearching ? styles.searchingState : '',
    className,
  ].filter(Boolean).join(' '), [isSearching, className]);

  const performSearch = useCallback(async (query: string) => {
    if (requestCountRef.current > 0) return;

    setIsSearching(true);
    setError(null);
    requestCountRef.current = 1;

    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await post<ImageItem[]>('/search', { query });
        setResults(data);
        setIsSearching(false);
        requestCountRef.current = 0;
        return;
      } catch (err: any) {
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, 500));
        } else {
          const errorMessage = err.message || TEXTS.ERRORS.SEARCH_ERROR;
          setError(errorMessage);
          setResults([]);
          toast.error(TEXTS.TOAST.ERROR_PREFIX + errorMessage);
          setIsSearching(false);
        }
      }
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (query.length > 3) {
        requestCountRef.current = 0;
        performSearch(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, debounceMs);
  }, [debounceMs, performSearch]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);
  
  const prevIsSearching = useRef(isSearching);

  useEffect(() => {
    onSearching(isSearching);
    if (prevIsSearching.current && !isSearching && searchQuery.trim()) {
      historyRef.current?.actions.addToHistory(searchQuery.trim(), results.length, averageConfidence);
    }
    prevIsSearching.current = isSearching;
  }, [isSearching, onSearching, searchQuery, results.length, averageConfidence]);
  
  useEffect(() => {
    onResults(results);
    if (!isInitialMount.current && searchQuery.trim()) {
      // History updated manually
    } else {
      isInitialMount.current = false;
    }
  }, [results, searchQuery, onResults]);

  useEffect(() => {
    onSearchQueryChange(searchQuery);
  }, [searchQuery, onSearchQueryChange]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    requestCountRef.current = 0;
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearchQuery(searchQuery); // Manually trigger search for history
      historyRef.current?.actions.closeHistory();
    } else if (event.key === 'Escape') {
      historyRef.current?.actions.closeHistory();
    }
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    clearSearch();
    historyRef.current?.actions.closeHistory();
  };
  
  const toggleHistory = () => {
    historyRef.current?.actions.toggleHistory();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    results,
    isSearching,
    error,
    historyRef,
    containerClasses,
    handleInputChange,
    handleKeyPress,
    handleHistorySelect,
    handleClearSearch,
    toggleHistory,
  };
};
