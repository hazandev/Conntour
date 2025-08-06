export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

export interface SpinnerConfig {
  duration: number;
  planetCount: number;
  orbitRadius: number;
}