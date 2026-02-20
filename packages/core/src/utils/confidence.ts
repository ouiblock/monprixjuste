import type { ConfidenceScoreParams } from '../types';

export function calculateConfidenceScore(params: ConfidenceScoreParams): number {
  let score = params.baseScore;

  // Bonus pour le nombre de comparables
  if (params.comparablesCount >= 10) score += 15;
  else if (params.comparablesCount >= 5) score += 10;
  else if (params.comparablesCount >= 3) score += 5;

  // Bonus pour la diversité des sources
  score += params.sourcesCount * 3;

  // Bonus pour la qualité des données
  if (params.hasQualityData) score += 5;

  return Math.min(100, Math.max(0, score));
}
