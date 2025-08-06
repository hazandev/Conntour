import React from 'react';
import type { ImageItem } from '../../types/ImageItem';
import styles from './ImageModal.module.scss';
import { ConfidenceIndicator } from '../ConfidenceIndicator';
import { useImageModal } from './useImageModal';

interface ImageModalProps {
  image: ImageItem;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const {
    isClosing,
    isExpanded,
    view,
    handleClose,
    handleBackdropClick,
    setView,
    setIsExpanded,
  } = useImageModal(onClose);

  const formattedDate = new Date(image.date_created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`${styles.modalBackdrop} ${isClosing ? styles.modalBackdropClosing : ''}`} onClick={handleBackdropClick}>
      <div className={`${styles.modalContent} ${isClosing ? styles.modalContentClosing : ''}`}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        <div className={styles.mobileToggle}>
          <button onClick={() => setView('image')} className={view === 'image' ? styles.active : ''}>Image</button>
          <button onClick={() => setView('details')} className={view === 'details' ? styles.active : ''}>Details</button>
        </div>

        <div className={`${styles.imageContainer} ${styles[view]}`}>
          <img src={image.url} alt={image.title} className={styles.image} />
        </div>
        <div className={`${styles.detailsContainer} ${styles[view]}`}>
          <div className={styles.detailsHeader}>
            <h2 className={styles.title}>{image.title}</h2>
            <p className={styles.date}>{formattedDate}</p>
            {image.confidence !== undefined && image.confidence !== null && image.confidence !== 0 && (
              <div className={styles.confidence}>
                <ConfidenceIndicator score={image.confidence} size="large" showLabel={true} />
              </div>
            )}
          </div>
          <div className={`${styles.descriptionContainer} ${isExpanded ? styles.expanded : ''}`}>
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: image.description || '' }} />
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className={styles.readMoreButton}>
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </div>
  );
};
