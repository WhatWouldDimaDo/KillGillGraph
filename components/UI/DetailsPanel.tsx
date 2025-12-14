import React from 'react';
import { NodeData } from '../../types';

interface DetailsPanelProps {
  node: NodeData | null;
  onClose: () => void;
  onNodeClick: (nodeId: string) => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ node, onClose, onNodeClick }) => {
  if (!node) return null;

  const renderLinkButton = (item: string | object) => {
    // Handle both string IDs/names and object references if they exist
    const name = typeof item === 'string' ? item : (item as any).name || (item as any).id || JSON.stringify(item);
    const id = typeof item === 'string' ? item : (item as any).id || (item as any).name;

    return (
      <button 
        onClick={() => onNodeClick(id)}
        className="text-left text-sm text-blue-400 hover:text-yellow-400 hover:underline transition-colors block w-full py-1"
      >
        ➜ {name}
      </button>
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-black/95 border-l border-gray-800 p-6 overflow-y-auto z-40 transform transition-transform duration-300 ease-in-out backdrop-blur-md shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
      >
        ✕
      </button>

      <div className="mt-8 mb-6">
        {node.posterUrl ? (
          <img 
            src={node.posterUrl} 
            alt={node.name} 
            className="w-full rounded-lg shadow-lg border-2"
            style={{ borderColor: node.color }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div 
             className="w-full aspect-[2/3] rounded-lg shadow-lg border-2 flex items-center justify-center bg-gray-900 text-center p-4"
             style={{ borderColor: node.color }}
          >
             <span className="text-gray-500 font-bold text-xl">{node.name}</span>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-1 text-white leading-tight">{node.name}</h2>
      <p className="text-gray-400 text-sm mb-4">{node.year} • {node.director}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {node.subclouds.map(sub => (
           <span key={sub} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
             {sub.replace('-', ' ')}
           </span>
        ))}
      </div>

      <div className="border-t border-gray-800 py-4">
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Metadata</h3>
        <p className="text-sm text-gray-300 mb-1"><span className="text-gray-500">Country:</span> {node.country.replace('|', ', ')}</p>
        <p className="text-sm text-gray-300"><span className="text-gray-500">Genres:</span> {node.genres.join(', ')}</p>
      </div>

      {node.influenceNotes && (
        <div className="border-t border-gray-800 py-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Influence Notes</h3>
            <p className="text-sm text-gray-300 italic border-l-2 border-gray-700 pl-3">"{node.influenceNotes}"</p>
        </div>
      )}

      {node.influencedBy && node.influencedBy.length > 0 && (
         <div className="border-t border-gray-800 py-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Influenced By</h3>
            <div className="pl-2">
                {node.influencedBy.map((inf, idx) => (
                    <div key={idx}>{renderLinkButton(inf)}</div>
                ))}
            </div>
         </div>
      )}
       
       {node.influences && node.influences.length > 0 && (
         <div className="border-t border-gray-800 py-4">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Influences</h3>
            <div className="pl-2">
                {node.influences.map((inf, idx) => (
                    <div key={idx}>{renderLinkButton(inf)}</div>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};

export default DetailsPanel;