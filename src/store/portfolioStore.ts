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


export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      apartments: [],
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
