export interface EmbroideryDetail {
  style: string;
  urduStyle?: string;
  description: string;
  urduDescription?: string;
}

export interface CraftPlacement {
  location: string;
  urduLocation?: string;
  detail: string;
  urduDetail?: string;
}

export interface Annotation {
  label: string;
  urduLabel?: string;
  x: number; // 0-1000 normalized
  y: number; // 0-1000 normalized
}

export interface AnalysisResult {
  title: string;
  urduTitle: string;
  embroideryStyles: EmbroideryDetail[];
  craftPlacement: CraftPlacement[];
  costEstimate: {
    min: number;
    max: number;
    currency: string;
  };
  productionInsight: {
    artisans: string;
    urduArtisans: string;
    days: string;
    urduDays: string;
  };
  smartInsight: string[];
  urduSmartInsight: string[];
  complexity: 'Low' | 'Medium' | 'High';
  annotations: Annotation[];
  colors: string[]; // Hex codes
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';
