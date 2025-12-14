
import React, { useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData, NodeData } from '../types';
import { createPosterNode, addStarfield } from '../utils/nodeHelpers';
import * as THREE from 'three';

interface GraphProps {
  data: GraphData;
  onNodeClick: (node: NodeData) => void;
  graphRef: React.MutableRefObject<any>;
  is2D: boolean;
  highlightedCategory: string | null;
}

const Graph: React.FC<GraphProps> = ({ data, onNodeClick, graphRef, is2D, highlightedCategory }) => {
  
  // Re-heat simulation when view mode changes
  useEffect(() => {
     if (graphRef.current) {
         graphRef.current.d3ReheatSimulation();
         if (is2D) {
            graphRef.current.cameraPosition({x: 0, y: 0, z: 400}, {x:0, y:0, z:0}, 1000);
         }
     }
  }, [is2D, graphRef]);

  // Configure d3 forces
  useEffect(() => {
    const fg = graphRef.current;
    if (!fg) return;

    // 1. LINK: Strong pull
    fg.d3Force('link')
      ?.distance((link: any) => {
          const s = (link.source as any).size || 10;
          const t = (link.target as any).size || 10;
          return (s + t) * 1.5; 
      })
      .strength(0.8);

    // 2. CHARGE: Repel
    fg.d3Force('charge')
      ?.strength(-120) 
      .distanceMax(250); 

    // 3. CENTER: Gravity
    fg.d3Force('center')?.strength(is2D ? 0.3 : 0.6);

    // 5. FLATTEN
    const flattenForce = (alpha: number) => {
      if (!is2D) return;
      const k = alpha * 0.5;
      data.nodes.forEach((node: any) => {
        if (node.z !== undefined && node.vz !== undefined) {
          node.vz -= node.z * k; 
        }
      });
    };
    fg.d3Force('flatten', flattenForce);

    fg.d3ReheatSimulation();

  }, [graphRef, is2D, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
       if (graphRef.current) {
          const scene = graphRef.current.scene();
          const existingStars = scene.children.find((c: any) => c.type === 'Points');
          if (!existingStars) {
             addStarfield(scene);
          }
       }
    }, 500);
    return () => clearTimeout(timer);
  }, [graphRef]);

  const nodeThreeObject = useCallback((node: any) => {
    const isDimmed = highlightedCategory 
      ? !node.subclouds.includes(highlightedCategory) 
      : false;
    return createPosterNode(node as NodeData, isDimmed);
  }, [highlightedCategory]);

  return (
    <div className="w-full h-screen">
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        nodeLabel={(node: any) => `${node.name} (${node.year})`}
        nodeThreeObject={nodeThreeObject}
        
        // --- VISIBILITY FIXES ---
        showNavInfo={false}
        // Link Width: Much thicker
        linkWidth={link => {
            if (highlightedCategory) {
                const source = link.source as NodeData;
                const target = link.target as NodeData;
                const sMatch = source.subclouds && source.subclouds.includes(highlightedCategory);
                const tMatch = target.subclouds && target.subclouds.includes(highlightedCategory);
                return (sMatch && tMatch) ? 4 : 0.2;
            }
            return 3; // Thicker default lines
        }} 
        // Link Color: Bright White default
        linkColor={(link: any) => {
           if (!highlightedCategory) return 'rgba(255,255,255,0.7)'; // High contrast white
           
           const source = link.source as NodeData;
           const target = link.target as NodeData;
           const sourceMatch = source.subclouds && source.subclouds.includes(highlightedCategory);
           const targetMatch = target.subclouds && target.subclouds.includes(highlightedCategory);
           
           return (sourceMatch && targetMatch) ? '#FFD700' : 'rgba(255,255,255,0.05)';
        }}
        linkDirectionalParticles={0} // Clean lines
        
        backgroundColor="#050505"
        
        numDimensions={3} 
        d3AlphaDecay={0.03} 
        d3VelocityDecay={0.3} 
        
        onNodeClick={(node) => {
          // PERFECT FRAMING:
          // Move camera to a position strictly on the Z-axis relative to the node
          // This ensures the 2D sprite is perfectly facing the camera
          const dist = 140;
          
          if (graphRef.current) {
            const newPos = {
                x: node.x,
                y: node.y,
                z: (node.z || 0) + dist 
            };
            
            graphRef.current.cameraPosition(
              newPos, 
              node, // lookAt center of node
              1500  // smooth transition
            );
          }
          onNodeClick(node as NodeData);
        }}
        onNodeHover={(node) => {
           document.body.style.cursor = node ? 'pointer' : 'default';
        }}
      />
    </div>
  );
};

export default Graph;
