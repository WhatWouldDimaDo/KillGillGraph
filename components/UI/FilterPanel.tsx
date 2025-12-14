
import React, { useState } from 'react';
import { ColorPalette } from '../../types';

interface FilterPanelProps {
  subclouds: string[];
  activeSubclouds: Set<string>;
  palette: ColorPalette;
  onToggle: (subcloud: string) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ subclouds, activeSubclouds, palette, onToggle, onReset }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed left-4 top-20 bg-black/90 rounded-xl border border-gray-800 backdrop-blur-md z-30 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col ${isCollapsed ? 'w-12 h-12' : 'w-64 max-h-[70vh]'}`}>
      
      {/* Header / Toggle */}
      <div 
        className="flex justify-between items-center p-3 border-b border-gray-800 bg-white/5 cursor-pointer hover:bg-white/10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && <h3 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h3>}
        
        <div className={`text-gray-400 transform transition-transform ${isCollapsed ? 'rotate-180 m-auto' : ''}`}>
           {isCollapsed ? '☰' : '−'}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="overflow-y-auto p-4 pt-2">
            <div className="flex justify-end mb-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); onReset(); }} 
                    className="text-[10px] uppercase text-yellow-500 hover:text-yellow-400 font-bold tracking-wide"
                >
                    Show All
                </button>
            </div>

            <div className="space-y-1">
                {subclouds.map(sc => {
                    const color = palette[sc] || '#888888';
                    const isActive = activeSubclouds.has(sc);

                    return (
                    <div 
                        key={sc} 
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all ${isActive ? 'bg-white/5' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                        onClick={() => onToggle(sc)}
                    >
                        <div 
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0`}
                        style={{ 
                            borderColor: color, 
                            backgroundColor: isActive ? color : 'transparent',
                            boxShadow: isActive ? `0 0 8px ${color}` : 'none'
                        }}
                        >
                        {isActive && <span className="text-black text-[8px] font-bold leading-none">✓</span>}
                        </div>
                        
                        <span className={`text-xs font-medium leading-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {sc.replace(/-/g, ' ')}
                        </span>
                    </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
