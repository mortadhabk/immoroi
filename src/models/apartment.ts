export type Charge = {
  id: string;
  type: string;
  amount: number;
  description?: string;
};

export type Revenue = {
  id: string;
  type: string;
  monthlyAmount: number;
};

export type Risk = {
  id: string;
  label: string;
};

export type Apartment = {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  surfaceM2: number;
  rooms: number;
  purchasePrice: number;
  notaryFees: number;
  agencyFees: number;
  bankFileFees: number;
  brokerFees: number;
  guaranteeFees: number;
  downPayment: number;
  loanYears: number;
  annualInterestRate?: number | null;
  bankInsuranceTotal: number;
  worksCost: number;
  charges: Charge[];
  revenues: Revenue[];
  risks: Risk[];
  createdAt: string;
  updatedAt: string;
};
