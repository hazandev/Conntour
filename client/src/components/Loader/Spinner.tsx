import React from 'react';
import { useSpinner } from './useSpinner';
import { generatePlanetPositions, getRandomPlanetColor } from './utils';
import type { SpinnerProps } from './types';
import './style.scss';

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  message = '', 
  className = '' 
}) => {
  const { config, sizeClass } = useSpinner(size);
  const planets = generatePlanetPositions(config.planetCount);

  return (
    <div className={`spinner ${sizeClass} ${className}`}>
      <div className="spinnerContainer">
        {/* Central Sun */}
        <div className="sun" />
        
        {/* Orbiting Planets */}
        {planets.map((planet, index) => (
          <div
            key={index}
            className="orbit"
            style={{
              width: `${config.orbitRadius * 2}px`,
              height: `${config.orbitRadius * 2}px`,
              animationDuration: `${config.duration + planet.delay}s`,
              animationDelay: `${planet.delay}s`,
            }}
          >
            <div
              className="planet"
              style={{
                color: getRandomPlanetColor(),
                transform: `scale(${planet.size})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
