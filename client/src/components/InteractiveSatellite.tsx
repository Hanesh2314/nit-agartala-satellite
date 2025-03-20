import { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/use-mobile';
import type { Department, SatellitePart } from '@/types';

interface InteractiveSatelliteProps {
  departments: Department[];
  onHover?: (departmentId: number | null) => void;
}

export default function InteractiveSatellite({ departments, onHover }: InteractiveSatelliteProps) {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);
  const [satelliteParts, setSatelliteParts] = useState<SatellitePart[]>([]);

  useEffect(() => {
    if (departments.length > 0) {
      // Generate satellite parts based on departments
      const parts: SatellitePart[] = departments.map((dept, index) => {
        // Create different positions based on index
        let position: [number, number, number] = [0, 0, 0];
        
        switch (index % 3) {
          case 0: // Engineering - top right
            position = [20, -15, 0];
            break;
          case 1: // Communications - bottom right
            position = [15, 10, 0];
            break;
          case 2: // Data Science - left side
            position = [-20, 0, 0];
            break;
        }
        
        return {
          name: dept.name,
          description: dept.description,
          position,
          departmentId: dept.id,
          color: dept.color,
        };
      });
      
      setSatelliteParts(parts);
    }
  }, [departments]);

  const handlePartHover = (departmentId: number | null) => {
    setHoveredPart(departmentId);
    if (onHover) onHover(departmentId);
  };

  const handlePartClick = (departmentId: number) => {
    navigate(`/departments/${departmentId}`);
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
      <motion.div 
        className="relative w-4/5 h-4/5 transform-style-preserve-3d"
        animate={{ rotateY: [0, 10, 0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut"
        }}
      >
        {/* Base Satellite Image */}
        <motion.img 
          src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80" 
          alt="Satellite" 
          className="w-full h-full object-cover rounded-xl shadow-lg shadow-blue-500/20"
          initial={{ scale: 0.9 }}
          animate={{ 
            scale: [0.95, 1, 0.95],
            y: [0, -10, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
        />
        
        {/* Interactive Parts */}
        {satelliteParts.map((part) => (
          <motion.div
            key={part.departmentId}
            className="absolute interactive-part rounded-full flex items-center justify-center cursor-pointer z-10"
            style={{ 
              left: `calc(50% + ${part.position[0]}%)`, 
              top: `calc(50% + ${part.position[1]}%)`,
              backgroundColor: `${part.color}BF` // 75% opacity
            }}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ 
              scale: hoveredPart === part.departmentId ? 1.2 : [0.9, 1.1, 0.9],
              opacity: hoveredPart === part.departmentId ? 1 : 0.8,
              boxShadow: hoveredPart === part.departmentId 
                ? `0 0 15px 5px ${part.color}80` 
                : `0 0 5px 2px ${part.color}40`
            }}
            transition={{ 
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            onMouseEnter={() => handlePartHover(part.departmentId)}
            onMouseLeave={() => handlePartHover(null)}
            onClick={() => handlePartClick(part.departmentId)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <i className={`fas fa-${departments.find(d => d.id === part.departmentId)?.icon || 'circle'} text-white`}></i>
            </div>
            
            {/* Tooltip */}
            <motion.div 
              className="absolute -top-12 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-white text-sm whitespace-nowrap pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: hoveredPart === part.departmentId ? 1 : 0,
                y: hoveredPart === part.departmentId ? 0 : 10
              }}
              transition={{ duration: 0.2 }}
            >
              {part.name}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
