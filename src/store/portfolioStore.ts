import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Apartment, Charge, Revenue } from '../models/apartment';
import { uid } from '../utils/id';

export type PortfolioState = {
  apartments: Apartment[];
  addApartment: () => string;
  updateApartment: (id: string, updater: (apartment: Apartment) => Apartment) => void;
  setApartment: (id: string, partial: Partial<Apartment>) => void;
  deleteApartment: (id: string) => void;
  duplicateApartment: (id: string) => string | null;
  resetApartment: (id: string) => void;
  importPortfolio: (data: Apartment[]) => void;
};

const emptyApartment = (): Apartment => {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: 'Nouveau bien',
    address: '',
    city: '',
    postalCode: '',
    surfaceM2: 0,
    rooms: 0,
    purchasePrice: 0,
    notaryFees: 0,
    agencyFees: 0,
    bankFileFees: 0,
    brokerFees: 0,
    guaranteeFees: 0,
    downPayment: 0,
    loanYears: 20,
    annualInterestRate: null,
    bankInsuranceTotal: 0,
    worksCost: 0,
    charges: [],
    revenues: [],
    createdAt: now,
    updatedAt: now,
  };
};

const withSeed = (): Apartment[] => {
  const now = new Date().toISOString();
  const baseCharges = (): Charge[] => [
    { id: uid(), type: 'Taxe Foncière', amount: 1100, description: 'Impôt annuel' },
    { id: uid(), type: 'Charges Copro', amount: 1200, description: 'Entretien copro' },
    { id: uid(), type: 'Entretien', amount: 600, description: 'Réparations annuelles' },
  ];
  const baseRevenues = (monthly: number): Revenue[] => [
    { id: uid(), type: 'Loyer', monthlyAmount: monthly },
  ];
  return [
    {
      id: uid(),
      name: 'T2 Mermoz',
      address: 'Mermoz',
      city: 'Toulouse',
      postalCode: '31100',
      surfaceM2: 46,
      rooms: 2,
      purchasePrice: 90000,
      notaryFees: 7200,
      agencyFees: 0,
      bankFileFees: 800,
      brokerFees: 0,
      guaranteeFees: 0,
      downPayment: 20000,
      loanYears: 20,
      annualInterestRate: null,
      bankInsuranceTotal: 5000,
      worksCost: 6000,
      charges: baseCharges(),
      revenues: baseRevenues(1000),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      name: 'T3 Bonnefoy',
      address: 'Rue de Naples',
      city: 'Toulouse',
      postalCode: '31500',
      surfaceM2: 54,
      rooms: 3,
      purchasePrice: 113000,
      notaryFees: 10000,
      agencyFees: 0,
      bankFileFees: 800,
      brokerFees: 0,
      guaranteeFees: 0,
      downPayment: 25000,
      loanYears: 22,
      annualInterestRate: 0.035,
      bankInsuranceTotal: 6500,
      worksCost: 8000,
      charges: baseCharges(),
      revenues: baseRevenues(1100),
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      apartments: withSeed(),
      addApartment: () => {
        const apt = emptyApartment();
        set((state) => ({ apartments: [apt, ...state.apartments] }));
        return apt.id;
      },
      updateApartment: (id, updater) => {
        set((state) => ({
          apartments: state.apartments.map((a) =>
            a.id === id ? { ...updater(a), updatedAt: new Date().toISOString() } : a
          ),
        }));
      },
      setApartment: (id, partial) => {
        set((state) => ({
          apartments: state.apartments.map((a) =>
            a.id === id ? { ...a, ...partial, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },
      deleteApartment: (id) => {
        set((state) => ({ apartments: state.apartments.filter((a) => a.id !== id) }));
      },
      duplicateApartment: (id) => {
        const source = get().apartments.find((a) => a.id === id);
        if (!source) return null;
        const copy: Apartment = {
          ...source,
          id: uid(),
          name: `${source.name} (copie)`,
          charges: source.charges.map((c) => ({ ...c, id: uid() })),
          revenues: source.revenues.map((r) => ({ ...r, id: uid() })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ apartments: [copy, ...state.apartments] }));
        return copy.id;
      },
      resetApartment: (id) => {
        set((state) => ({
          apartments: state.apartments.map((a) =>
            a.id === id ? { ...emptyApartment(), id } : a
          ),
        }));
      },
      importPortfolio: (data) => {
        const sanitized = data.map((a) => ({
          ...a,
          id: a.id || uid(),
          charges: a.charges?.map((c) => ({ ...c, id: c.id || uid() })) || [],
          revenues: a.revenues?.map((r) => ({ ...r, id: r.id || uid() })) || [],
          createdAt: a.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        set(() => ({ apartments: sanitized }));
      },
    }),
    { name: 'roi-portfolio' }
  )
);

export const createCharge = (): Charge => ({ id: uid(), type: '', amount: 0 });
export const createRevenue = (): Revenue => ({ id: uid(), type: '', monthlyAmount: 0 });
