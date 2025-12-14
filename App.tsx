
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Graph from './components/Graph';
import DetailsPanel from './components/UI/DetailsPanel';
import FilterPanel from './components/UI/FilterPanel';
import SearchBar from './components/UI/SearchBar';
import Legend from './components/UI/Legend';
import { INITIAL_GRAPH_DATA, COLOR_PALETTE } from './data/graphData';
import { NodeData } from './types';

function App() {
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [is2D, setIs2D] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Filtering Logic
  const allSubclouds = useMemo(() => {
    const set = new Set<string>();
    INITIAL_GRAPH_DATA.nodes.forEach(n => n.subclouds.forEach(sc => set.add(sc)));
    return Array.from(set).sort();
  }, []);

  const [activeSubclouds, setActiveSubclouds] = useState<Set<string>>(new Set(allSubclouds));

  const filteredData = useMemo(() => {
    const visibleNodes = INITIAL_GRAPH_DATA.nodes.filter(n => 
       n.subclouds.some(sc => activeSubclouds.has(sc))
    );
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    
    const visibleLinks = INITIAL_GRAPH_DATA.links.filter(l => {
       const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
       const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
       return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return { nodes: visibleNodes, links: visibleLinks };
  }, [activeSubclouds]);

  const handleNodeSelect = (node: NodeData) => {
    setSelectedNode(node);
    if (graphRef.current) {
        // Zoom closer for selection
        const dist = 140;
        graphRef.current.cameraPosition(
          { 
            x: node.x, 
            y: node.y, 
            z: (node.z || 0) + dist 
          }, 
          { x: node.x, y: node.y, z: node.z },
          1500 
        );
    }
  };

  const findAndSelectNode = (identifier: string) => {
     const target = INITIAL_GRAPH_DATA.nodes.find(n => 
       n.id === identifier || 
       n.name === identifier ||
       n.fullTitle === identifier
     ); 
     if (target) {
       handleNodeSelect(target);
     }
  };

  const handleResetCamera = () => {
      // Find Kill Bill 1 as the anchor
      const kb = INITIAL_GRAPH_DATA.nodes.find(n => n.id.includes('kill-bill-vol-1'));
      
      if(graphRef.current && kb && kb.x) {
          graphRef.current.cameraPosition(
              { x: kb.x, y: kb.y, z: (kb.z || 0) + 500 }, // Back up
              { x: kb.x, y: kb.y, z: kb.z },
              2000
          );
      } else if (graphRef.current) {
          graphRef.current.zoomToFit(1000, 100);
      }
      setSelectedNode(null);
  };

  const toggleSubcloud = (sc: string) => {
    const newSet = new Set(activeSubclouds);
    if (newSet.has(sc)) {
      newSet.delete(sc);
    } else {
      newSet.add(sc);
    }
    setActiveSubclouds(newSet);
  };

  const resetFilters = () => setActiveSubclouds(new Set(allSubclouds));

  return (
    <div className="w-screen h-screen relative bg-black font-sans overflow-hidden">
      
      {/* Top Bar with Search - Elevated Z-index */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 flex justify-center items-start pointer-events-none">
          <SearchBar nodes={INITIAL_GRAPH_DATA.nodes} onSelect={handleNodeSelect} />
      </div>

      {/* Filter Panel (Left) */}
      <FilterPanel 
        subclouds={allSubclouds}
        activeSubclouds={activeSubclouds}
        palette={COLOR_PALETTE}
        onToggle={toggleSubcloud}
        onReset={resetFilters}
      />

      {/* View Controls - MOVED TO BOTTOM RIGHT to avoid blocking sidebar */}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col items-end gap-3 pointer-events-auto">
          <button 
              onClick={() => setIs2D(!is2D)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border backdrop-blur-md transition-all shadow-lg hover:scale-105 ${is2D ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-gray-900/80 text-gray-300 border-gray-600 hover:border-white'}`}
          >
              {is2D ? 'View: 2D' : 'View: 3D'}
          </button>
          <button 
              onClick={handleResetCamera}
              className="bg-gray-900/80 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-600 hover:border-white backdrop-blur-md transition-all shadow-lg hover:scale-105"
          >
              Reset Camera
          </button>
      </div>

      {/* Details Panel (Right Sidebar) */}
      <DetailsPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)}
        onNodeClick={findAndSelectNode}
      />

      <Graph 
        data={filteredData}
        onNodeClick={handleNodeSelect}
        graphRef={graphRef}
        is2D={is2D}
        highlightedCategory={hoveredCategory}
      />

      <Legend 
        palette={COLOR_PALETTE} 
        onHoverCategory={setHoveredCategory}
      />
    </div>
  );
}

export default App;
