export const generatePlanetPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const delay = (i * 0.2); // Stagger the animation
    return {
      angle,
      delay,
      size: Math.random() * 0.5 + 0.5, // Random size between 0.5 and 1
    };
  });
};

export const getRandomPlanetColor = () => {
  const planetColors = [
    '#FF6B6B', // Mars red
    '#4ECDC4', // Uranus blue-green
    '#45B7D1', // Neptune blue
    '#96CEB4', // Earth green
    '#FFEAA7', // Venus yellow
    '#DDA0DD', // Purple
    '#87CEEB', // Sky blue
    '#F0E68C', // Khaki
  ];
  
  return planetColors[Math.floor(Math.random() * planetColors.length)];
};