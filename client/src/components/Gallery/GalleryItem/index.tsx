import React, { useState, memo } from 'react';
import styles from './GalleryItem.module.scss';
import type { ImageItem } from '../../../types/ImageItem';
import { ConfidenceIndicator } from '../../ConfidenceIndicator';
import { PLACEHOLDER_IMAGE } from '../../../constants/image';

interface GalleryItemProps {
  image: ImageItem;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, onClick }) => {
  const [imgSrc, setImgSrc] = useState(image.url);

  const handleError = () => {
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img
          src={imgSrc}
          alt={image.title}
          className={styles.image}
          loading="lazy"
          onError={handleError}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{image.title}</h3>
          <div className={styles.metadata}>
            <span className={styles.date}>{new Date(image.date_created).toLocaleDateString()}</span>
            <span className={styles.source}>{image.source}</span>
          </div>
        </div>
        
        {image.confidence !== undefined && image.confidence !== null && image.confidence !== 0 && (
          <div className={styles.confidence}>
            <ConfidenceIndicator 
              score={image.confidence} 
              size="small" 
              showLabel={true}
            />
          </div>
        )}
        
        {image.description && (
          <p className={styles.description}>{image.description}</p>
        )}
      </div>
    </div>
  );
};

export default memo(GalleryItem);
