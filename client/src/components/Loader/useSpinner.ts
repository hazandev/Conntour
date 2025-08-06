import { useMemo } from 'react';
import type { SpinnerConfig } from './types';

export const useSpinner = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const config: SpinnerConfig = useMemo(() => {
    switch (size) {
      case 'small':
        return {
          duration: 2,
          planetCount: 3,
          orbitRadius: 20,
        };
      case 'large':
        return {
          duration: 3,
          planetCount: 8,
          orbitRadius: 50,
        };
      default: // medium
        return {
          duration: 2.5,
          planetCount: 6,
          orbitRadius: 35,
        };
    }
  }, [size]);

  const sizeClass = useMemo(() => {
    switch (size) {
      case 'small':
        return 'spinner--small';
      case 'large':
        return 'spinner--large';
      default:
        return 'spinner--medium';
    }
  }, [size]);

  return {
    config,
    sizeClass,
  };
};