import { useState, useMemo } from 'react';
import type { ImageItem } from '../../types/ImageItem';
import type { SortOption } from '../SortControls';

interface UseSortImagesReturn {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  sortedImages: ImageItem[];
  averageConfidence: number;
}

export const useSortImages = (images: ImageItem[]): UseSortImagesReturn => {
  const [sortOption, setSortOption] = useState<SortOption>('confidence-desc');

  const averageConfidence = useMemo(() => {
    if (!images.length) return 0;
    const total = images.reduce((sum, image) => sum + (image.confidence || 0), 0);
    return total / images.length;
  }, [images]);

  const sortedImages = useMemo(() => {
    const imagesCopy = [...images];
    if (sortOption === 'confidence-asc') {
      return imagesCopy.sort((a, b) => (a.confidence || 0) - (b.confidence || 0));
    }
    return imagesCopy.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }, [images, sortOption]);

  return {
    sortOption,
    setSortOption,
    sortedImages,
    averageConfidence,
  };
};
