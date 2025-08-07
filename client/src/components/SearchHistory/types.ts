export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultsCount?: number;
  confidence?: number;
}

export interface SearchHistoryProps {
  onSelectQuery: (query: string) => void;
}
