import { useState, useEffect, useCallback, useMemo } from 'react';

const SEARCH_HISTORY_KEY = 'nasa_search_history';
const MAX_HISTORY_ITEMS = 100; // Increased limit to allow more history
const ITEMS_PER_PAGE = 8; // Items to show per page in dropdown

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultsCount?: number;
  confidence?: number;
}

interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  paginatedHistory: SearchHistoryItem[];
  addToHistory: (query: string, resultsCount?: number, avgConfidence?: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  isHistoryOpen: boolean;
  toggleHistory: () => void;
  closeHistory: () => void;
  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  // Development helper
  addTestData: () => void;
}

export const useSearchHistory = (): UseSearchHistoryReturn => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as SearchHistoryItem[];
        // Sort by timestamp descending (most recent first)
        const sortedHistory = parsedHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sortedHistory);
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistoryToStorage = useCallback((newHistory: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }, []);

  // Add a new search query to history
  const addToHistory = useCallback((query: string, resultsCount?: number, avgConfidence?: number) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setHistory(prevHistory => {
      // Remove existing entry if it exists (to avoid duplicates)
      const filteredHistory = prevHistory.filter(
        item => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      );

      // Create new history item
      const newItem: SearchHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        query: trimmedQuery,
        timestamp: Date.now(),
        resultsCount,
        confidence: avgConfidence,
      };

      // Add new item to the beginning and limit to MAX_HISTORY_ITEMS
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      saveHistoryToStorage(newHistory);
      
      return newHistory;
    });
  }, [saveHistoryToStorage]);

  // Remove a specific item from history
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id);
      saveHistoryToStorage(newHistory);
      return newHistory;
    });
  }, [saveHistoryToStorage]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Failed to clear search history:', error);
    }
  }, []);

  // Toggle history dropdown visibility
  const toggleHistory = useCallback(() => {
    setIsHistoryOpen(prev => !prev);
  }, []);

  // Close history dropdown
  const closeHistory = useCallback(() => {
    setIsHistoryOpen(false);
  }, []);

  // Pagination calculations
  const totalPages = useMemo(() => Math.ceil(history.length / ITEMS_PER_PAGE), [history.length]);
  
  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return history.slice(startIndex, endIndex);
  }, [history, currentPage]);

  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Pagination navigation functions
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Reset to page 1 when history changes (e.g., when adding/removing items)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Development helper function to add test data
  const addTestData = useCallback(() => {
    const testQueries = [
      'Mars rover exploration', 'Saturn rings close up', 'Jupiter red spot',
      'International Space Station', 'Nebula formations', 'Solar eclipse', 
      'Moon landing sites', 'Galaxy spiral arms', 'Asteroid belt',
      'Space shuttle missions', 'Cosmic microwave background', 'Black hole images',
      'Venus surface mapping', 'Mercury transit', 'Comet tail formation',
      'Aurora borealis from space', 'Earth curvature photos', 'Hubble deep field',
      'Mars polar ice caps', 'Titan methane lakes', 'Europa ice geysers',
      'Voyager golden record', 'Space telescope imagery', 'Exoplanet discoveries'
    ];
    
    testQueries.forEach((query, index) => {
      setTimeout(() => {
        addToHistory(query, Math.floor(Math.random() * 500) + 10, Math.random() * 0.5 + 0.5);
      }, index * 100);
    });
  }, [addToHistory]);

  // Expose addTestData for development (can be called from console)
  if (typeof window !== 'undefined') {
    (window as any).addTestSearchHistory = addTestData;
  }

  return {
    history,
    paginatedHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isHistoryOpen,
    toggleHistory,
    closeHistory,
    // Pagination
    currentPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    // Development helper
    addTestData,
  };
};
