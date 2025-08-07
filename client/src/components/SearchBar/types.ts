import type { ImageItem } from '../../types/ImageItem';

export interface SearchHistoryHandle {
  actions: {
    toggleHistory: () => void;
    closeHistory: () => void;
    addToHistory: (query: string, resultsCount?: number, avgConfidence?: number) => void;
  };
}

export interface UseSearchBarProps {
  onResults: (results: ImageItem[]) => void;
  onSearchQueryChange: (query: string) => void;
  onSearching: (isSearching: boolean) => void;
  debounceMs?: number;
  averageConfidence?: number;
  className?: string;
}

