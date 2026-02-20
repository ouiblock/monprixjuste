import type { UnifiedEstimation } from '../types';

const STORAGE_KEY = 'monprixjuste_history';
const MAX_HISTORY_ITEMS = 20;

export function saveEstimation(estimation: UnifiedEstimation): void {
  const history = getHistory();
  const newHistory = [estimation, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function getHistory(): UnifiedEstimation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

export function getHistoryByVertical(vertical: UnifiedEstimation['vertical']): UnifiedEstimation[] {
  return getHistory().filter((item) => item.vertical === vertical);
}

export function deleteEstimation(id: string): void {
  const history = getHistory();
  const newHistory = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
