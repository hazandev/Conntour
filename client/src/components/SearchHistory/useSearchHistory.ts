import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SearchHistoryItem } from './types';

const SEARCH_HISTORY_KEY = 'nasa_search_history';
const MAX_HISTORY_ITEMS = 100;
const ITEMS_PER_PAGE = 8;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as SearchHistoryItem[];
        setHistory(parsedHistory.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
      setHistory([]);
    }
  }, []);

  const saveHistoryToStorage = useCallback((newHistory: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, []);

  const addToHistory = useCallback((query: string, resultsCount?: number, avgConfidence?: number) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(
        item => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );
      const newItem: SearchHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        query: trimmedQuery,
        timestamp: Date.now(),
        resultsCount,
        confidence: avgConfidence,
      };
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      saveHistoryToStorage(newHistory);
      return newHistory;
    });
  }, [saveHistoryToStorage]);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id);
      saveHistoryToStorage(newHistory);
      return newHistory;
    });
  }, [saveHistoryToStorage]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }, []);

  const toggleHistory = useCallback(() => setIsHistoryOpen(prev => !prev), []);
  const closeHistory = useCallback(() => setIsHistoryOpen(false), []);

  const totalPages = useMemo(() => Math.ceil(history.length / ITEMS_PER_PAGE), [history.length]);
  
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return history.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [history, currentPage]);

  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  const nextPage = useCallback(() => {
    if (hasNextPage) setCurrentPage(prev => prev + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setCurrentPage(prev => prev - 1);
  }, [hasPrevPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return {
    history,
    paginatedHistory,
    isHistoryOpen,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    actions: {
      addToHistory,
      removeFromHistory,
      clearHistory,
      toggleHistory,
      closeHistory,
      nextPage,
      prevPage,
      goToPage,
    },
  };
};
