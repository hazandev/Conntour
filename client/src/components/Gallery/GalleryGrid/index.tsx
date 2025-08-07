import React from 'react';
import GalleryItem from '../GalleryItem';
import type { ImageItem } from '../../../types/ImageItem';
import styles from './GalleryGrid.module.scss';

interface GalleryGridProps {
  images: ImageItem[];
  onImageClick: (image: ImageItem) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick }) => {
  return (
    <div className={styles.galleryGrid}>
      {images.map(image => (
        <GalleryItem key={image.id} image={image} onClick={() => onImageClick(image)} />
      ))}
    </div>
  );
};
