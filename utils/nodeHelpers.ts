import * as THREE from 'three';
import { NodeData } from '../types';

export const createPosterNode = (node: NodeData, isDimmed: boolean = false): THREE.Object3D => {
  // SPECIAL HANDLING: Kill Bill nodes are anchors, make them HUGE
  const isCenterNode = node.name.toLowerCase().includes('kill bill');
  const sizeMultiplier = isCenterNode ? 3.0 : 1.8;
  
  // Base scale calculation
  const baseScale = (node.size || 10) * sizeMultiplier; 
  const width = baseScale;
  const height = width * 1.5; // 2:3 aspect ratio

  const group = new THREE.Group();

  // Opacity & Color
  const opacity = isDimmed ? 0.15 : 1.0;
  const borderColor = isCenterNode ? '#FFD700' : (isDimmed ? '#444444' : node.color);

  // --- BORDER SPRITE ---
  const borderCanvas = document.createElement('canvas');
  borderCanvas.width = 64; 
  borderCanvas.height = 64;
  const bCtx = borderCanvas.getContext('2d');
  if(bCtx) {
      bCtx.fillStyle = borderColor;
      bCtx.fillRect(0,0,64,64);
  }
  const borderTexture = new THREE.CanvasTexture(borderCanvas);
  borderTexture.colorSpace = THREE.SRGBColorSpace;
  
  const borderMaterial = new THREE.SpriteMaterial({ 
      map: borderTexture,
      transparent: true,
      opacity: opacity,
      depthWrite: false, // CRITICAL: Fixes transparency sorting issues
      depthTest: true
  });
  const borderSprite = new THREE.Sprite(borderMaterial);
  
  // Border thickness logic
  const borderThickness = isCenterNode ? 6 : 3; 
  borderSprite.scale.set(width + borderThickness, height + borderThickness, 1);
  // Push border slightly back so content sits on top
  borderSprite.position.z = -0.1;
  group.add(borderSprite);


  // --- CONTENT SPRITE ---
  const createPlaceholderTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = isDimmed ? '#1a1a1a' : (node.color || '#333');
      ctx.fillRect(0, 0, 400, 600);
      
      // Gradient overlay for depth
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 600);

      // Text
      ctx.fillStyle = isDimmed ? '#555' : '#ffffff';
      ctx.font = 'bold 44px Arial'; 
      ctx.textAlign = 'center';
      
      // Wrap text
      const words = node.name.split(' ');
      let line = '';
      let y = 240;
      const lineHeight = 55;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > 360 && n > 0) {
          ctx.fillText(line, 200, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 200, y);

      ctx.font = '32px Arial';
      ctx.fillStyle = isDimmed ? '#555' : '#cccccc';
      ctx.fillText(`(${node.year})`, 200, y + 60);
    }
    return new THREE.CanvasTexture(canvas);
  };

  let texture: THREE.Texture;
  const placeholderTexture = createPlaceholderTexture();

  const applyTextureSettings = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
  };
  applyTextureSettings(placeholderTexture);

  const contentMaterial = new THREE.SpriteMaterial({ 
    map: placeholderTexture, 
    transparent: true,
    opacity: opacity,
    depthWrite: false, // CRITICAL for sorting
    depthTest: true
  });

  if (node.posterUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(node.posterUrl, (loadedTex) => {
        applyTextureSettings(loadedTex);
        contentMaterial.map = loadedTex;
        contentMaterial.needsUpdate = true;
    }, undefined, () => {
        // Keep placeholder on error
    });
  }

  const contentSprite = new THREE.Sprite(contentMaterial);
  contentSprite.scale.set(width, height, 1);
  group.add(contentSprite);

  return group;
};

export const addStarfield = (scene: THREE.Scene) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    // Condensed starfield to match tighter graph
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 1500;
        const y = (Math.random() - 0.5) * 1500;
        const z = (Math.random() - 0.5) * 1000;
        starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0x666666, size: 1.0, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}