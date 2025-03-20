import { useEffect, useState } from 'react';

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  duration: number;
  delay: number;
};

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const createStars = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const starCount = Math.floor((windowWidth * windowHeight) / 1000);
      
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.8,
          twinkle: Math.random() > 0.7,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 5,
        });
      }
      
      setStars(newStars);
    };
    
    createStars();
    
    const handleResize = () => {
      createStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${star.twinkle ? 'animate-twinkle' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
