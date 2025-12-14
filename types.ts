export interface NodeData {
  id: string;
  name: string;
  fullTitle: string;
  year: number;
  director: string;
  country: string;
  genres: string[];
  subclouds: string[];
  posterUrl: string | null;
  tmdbId?: number | string | null;
  color: string;
  influenceNotes?: string | null;
  influencedBy: string[];
  influences: (string | object)[];
  influenceCount: number;
  size: number;
  localPosterPath?: string;
  // Force graph props
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface LinkData {
  source: string | NodeData;
  target: string | NodeData;
  type: string;
}

export interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
}

export interface ColorPalette {
  [key: string]: string;
}