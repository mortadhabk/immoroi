import type { Apartment } from '../../models/apartment';
import type { ApartmentMetrics } from '../../services/calculations/calculations';

export type ApartmentWithMetrics = {
  apartment: Apartment;
  metrics: ApartmentMetrics;
  completion: { filled: number; total: number; ratio: number; missing: string[] };
};
