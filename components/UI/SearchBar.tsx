import React, { useState, useMemo } from 'react';
import { NodeData } from '../../types';

interface SearchBarProps {
  nodes: NodeData[];
  onSelect: (node: NodeData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ nodes, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredNodes = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return nodes.filter(n => n.name.toLowerCase().includes(lower) || n.year.toString().includes(lower)).slice(0, 5);
  }, [nodes, query]);

  return (
    <div className="relative w-full max-w-md mx-auto pointer-events-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-black/80 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          placeholder="Search films..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <div className="absolute right-3 top-2 text-gray-400">
           🔍
        </div>
      </div>
      
      {isOpen && filteredNodes.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-gray-700 rounded-lg overflow-hidden z-50">
          {filteredNodes.map(node => (
            <div
              key={node.id}
              className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onSelect(node);
                setQuery(node.name);
                setIsOpen(false);
              }}
            >
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }}></div>
               <div>
                   <div className="font-bold text-sm">{node.name}</div>
                   <div className="text-xs text-gray-400">{node.year}</div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;