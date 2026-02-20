export type Vertical = 'immobilier' | 'automobile';

export interface UnifiedEstimation {
  id: string;
  vertical: Vertical;
  name: string;
  date: string;
  finalPrice: number;
  metadata: {
    // Immobilier
    address?: string;
    surface?: number;
    // Automobile
    brand?: string;
    model?: string;
    year?: number;
    mileage?: number;
  };
  thumbnail?: string;
}

export interface ConfidenceScoreParams {
  baseScore: number;
  comparablesCount: number;
  sourcesCount: number;
  hasQualityData: boolean;
}

export type Language = 'fr' | 'en';

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  vertical: Vertical;
  language: Language;
  includeDisclaimer: boolean;
}
