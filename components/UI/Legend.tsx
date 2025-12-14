import React from 'react';
import { ColorPalette } from '../../types';

interface LegendProps {
  palette: ColorPalette;
  onHoverCategory: (category: string | null) => void;
}

const Legend: React.FC<LegendProps> = ({ palette, onHoverCategory }) => {
  // Broaden list to ensure major categories are covered
  const keyCategories = [
    'kill-bill-core', 
    'samurai', 
    'kung-fu', 
    'spaghetti-western', 
    'exploitation', 
    'modern-revenge',
    'blaxploitation',
    'film-noir',
    'anime-influenced'
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] md:w-auto max-w-full overflow-x-auto bg-black/80 px-6 py-3 rounded-full border border-gray-800 backdrop-blur-sm z-30 flex gap-6 scrollbar-hide">
      {keyCategories.map(cat => (
        <div 
          key={cat} 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors flex-shrink-0"
          onMouseEnter={() => onHoverCategory(cat)}
          onMouseLeave={() => onHoverCategory(null)}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette[cat] }}></div>
          <span className="text-xs text-gray-300 font-medium whitespace-nowrap uppercase tracking-wider">
            {cat.replace(/-/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;