/**
 * @fileoverview Centralized text constants for the Space Explorer application
 */

export const TEXTS = {
  // Error messages
  ERRORS: {
    NETWORK_ERROR: 'Network error occurred. Please try again later.',
    SEARCH_ERROR: 'Search failed. Please try again later.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please refresh the page.',
    LOADING_ERROR: 'Failed to load images. Please try again later.',
    SEARCH_FAILED: 'Search failed after multiple attempts. Please try again.',
  },

  // Loading messages
  LOADING: {
    INITIAL_LOAD: 'Loading space images...',
    SEARCHING: 'Searching images: "{query}"...',
  },

  // Empty state messages
  EMPTY_STATES: {
    NO_IMAGES_FOUND: 'No images found',
    NO_SEARCH_RESULTS: 'No images found for "{query}"',
    NO_SEARCH_RESULTS_MESSAGE: 'Try searching with different keywords or another topic',
    NO_IMAGES_MESSAGE: 'Try searching for something interesting!',
  },

  // Error state messages
  ERROR_STATES: {
    LOAD_FAILED: 'Failed to load images',
    SEARCH_FAILED: 'Problem searching for "{query}". Try different keywords or refresh the page',
    GENERAL_ERROR: 'Please refresh the page or try again later',
  },

  // Search related
  SEARCH: {
    PLACEHOLDER: 'Search NASA images...',
    CLEAR_BUTTON: 'Clear search',
    HISTORY_BUTTON: 'Search history',
  },

  // Modal related
  MODAL: {
    CLOSE_BUTTON: 'Close',
    READ_MORE: 'Read More',
    SHOW_LESS: 'Show Less',
    IMAGE_VIEW: 'Image',
    DETAILS_VIEW: 'Details',
  },

  // Gallery controls
  CONTROLS: {
    RESULTS_COUNT: '{count} results',
    SORT_HIGHEST: 'Highest Confidence',
    SORT_LOWEST: 'Lowest Confidence',
  },

  // Error boundary
  ERROR_BOUNDARY: {
    TITLE: 'An unexpected error occurred',
    MESSAGE: 'Please refresh the page or try again later',
    REFRESH_BUTTON: 'Refresh Page',
  },

  // Toast messages
  TOAST: {
    ERROR_PREFIX: '❗ ',
  },
} as const;

// Helper function to replace placeholders in text
export const formatText = (text: string, replacements: Record<string, string>): string => {
  let formattedText = text;
  Object.entries(replacements).forEach(([key, value]) => {
    formattedText = formattedText.replace(`{${key}}`, value);
  });
  return formattedText;
}; 