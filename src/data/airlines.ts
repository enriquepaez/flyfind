import type { Airline } from '../types/types';

export const airlines: Record<string, Airline> = {
  UX: {
    code: 'UX',
    name: 'Air Europa',
    logoUrl: '/logos/air-europa.svg',
  },
  IB: {
    code: 'IB',
    name: 'Iberia',
    logoUrl: '/logos/iberia.png',
  },
};
