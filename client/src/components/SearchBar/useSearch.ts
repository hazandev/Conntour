import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { ImageItem } from '../../types/ImageItem';
import { post } from '../../utils/fetchClient'; // Using the fetchClient directly

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: ImageItem[];
  isSearching: boolean;
  error: string | null;
  clearSearch: () => void;
}

export const useSearch = (debounceMs: number = 1000): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<ImageItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestCountRef = useRef(0);

  const performSearch = useCallback(async (query: string) => {
    if (requestCountRef.current > 0) return; // Prevent multiple searches from starting

    setIsSearching(true);
    setError(null);
    requestCountRef.current = 1;

    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const data = await post<ImageItem[]>('/search', { query });
        setResults(data);
        setIsSearching(false);
        requestCountRef.current = 0; // Reset counter on success
        return; // Exit on success
      } catch (err: any) {
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, 500)); // Wait before retrying
        } else {
          const errorMessage = err.message || 'An error occurred during search.';
          setError(errorMessage);
          setResults([]);
          toast.error(`Search failed after ${maxRetries + 1} attempts: ${errorMessage}`);
          setIsSearching(false);
          // Do not reset counter here to prevent further automatic searches for the same query
        }
      }
    }
  }, []);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (query.length > 3) {
          requestCountRef.current = 0; // Reset counter for a new query
          performSearch(query);
        } else {
          setResults([]);
          setError(null);
        }
      }, debounceMs);
    },
    [debounceMs, performSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    requestCountRef.current = 0; // Reset counter on clear
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    results,
    isSearching,
    error,
    clearSearch,
  };
};
