/**
 * @fileoverview This file contains helper functions for sorting images.
 */

import type { ImageItem } from '../types/ImageItem';
import type { SortOption } from '../components/SortControls';

export const sortImages = (images: ImageItem[], sortOption: SortOption): ImageItem[] => {
  const imagesCopy = [...images];
  switch (sortOption) {
    case 'confidence-asc':
      return imagesCopy.sort((a, b) => (a.confidence || 0) - (b.confidence || 0));
    case 'confidence-desc':
    default:
      return imagesCopy.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }
};
