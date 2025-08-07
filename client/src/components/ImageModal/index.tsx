import React from 'react';
import type { ImageItem } from '../../types/ImageItem';
import styles from './ImageModal.module.scss';
import { ConfidenceIndicator } from '../ConfidenceIndicator';
import { useImageModal } from './useImageModal';
import { TEXTS } from '../../constants/texts';

interface ImageModalProps {
  image: ImageItem;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const {
    isClosing,
    isExpanded,
    view,
    descriptionRef,
    showReadMore,
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
      <div className={`${styles.modalContent} ${isClosing ? styles.modalContentClosing : ''} ${styles[view + 'View']}`}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        <div className={styles.mobileToggle}>
          <button onClick={() => setView('image')} className={view === 'image' ? styles.active : ''}>{TEXTS.MODAL.IMAGE_VIEW}</button>
          <button onClick={() => setView('details')} className={view === 'details' ? styles.active : ''}>{TEXTS.MODAL.DETAILS_VIEW}</button>
        </div>

        <div className={styles.imageContainer}>
          <img src={image.url} alt={image.title} className={styles.image} />
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <h2 className={styles.title}>{image.title}</h2>
            <p className={styles.date}>{formattedDate}</p>
            {image.confidence !== undefined && image.confidence !== null && image.confidence !== 0 && (
              <div className={styles.confidence}>
                <ConfidenceIndicator score={image.confidence} size="large" showLabel={true} />
              </div>
            )}
          </div>
          <div className={`${styles.descriptionContainer} ${isExpanded ? styles.expanded : ''} animated-scrollbar`}>
            <p ref={descriptionRef} className={styles.description} dangerouslySetInnerHTML={{ __html: image.description || '' }} />
          </div>
          {showReadMore && (
            <button onClick={() => setIsExpanded(!isExpanded)} className={styles.readMoreButton}>
              {isExpanded ? TEXTS.MODAL.SHOW_LESS : TEXTS.MODAL.READ_MORE}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
