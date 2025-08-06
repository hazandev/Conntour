import { useState, useEffect } from 'react';

export const useImageModal = (onClose: () => void) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [view, setView] = useState<'image' | 'details'>('image');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 500); // Match animation duration
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return {
    isClosing,
    isExpanded,
    view,
    handleClose,
    handleBackdropClick,
    setView,
    setIsExpanded,
  };
};
