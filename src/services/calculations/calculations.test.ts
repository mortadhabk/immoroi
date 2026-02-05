import { describe, it, expect } from 'vitest';
import { computeInvestmentMetrics, pmt } from './calculations';
import type { Apartment } from '../../models/apartment';

const baseApartment: Apartment = {
  id: 'apt-1',
  name: 'Test',
  address: '',
  city: 'Paris',
  postalCode: '75000',
  surfaceM2: 40,
  rooms: 2,
  purchasePrice: 100000,
  notaryFees: 8000,
  agencyFees: 0,
  bankFileFees: 800,
  brokerFees: 0,
  guaranteeFees: 0,
  downPayment: 20000,
  loanYears: 20,
  annualInterestRate: 0.03,
  bankInsuranceTotal: 4000,
  worksCost: 5000,
  charges: [{ id: 'c1', type: 'Taxe', amount: 1200 }],
  revenues: [{ id: 'r1', type: 'Loyer', monthlyAmount: 900 }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('calculations', () => {
  it('calculates monthly payment with PMT', () => {
    const loanAmount = 100000;
    const monthly = pmt(loanAmount, 0.03, 20);
    expect(monthly).toBeGreaterThan(0);
    expect(monthly).toBeLessThan(600);
  });

  it('computes cashflow after debt', () => {
    const metrics = computeInvestmentMetrics(baseApartment);
    expect(metrics.cashFlowMonthAfterDebt).toBeDefined();
    expect(Number.isFinite(metrics.cashFlowMonthAfterDebt)).toBe(true);
  });

  it('computes gross and net yields', () => {
    const metrics = computeInvestmentMetrics(baseApartment);
    expect(metrics.grossYieldPercent).toBeGreaterThan(0);
    expect(metrics.netYieldPercent).toBeGreaterThan(0);
  });

  it('computes NOI and DSCR', () => {
    const metrics = computeInvestmentMetrics(baseApartment);
    expect(metrics.noi).toBeGreaterThan(0);
    expect(metrics.dscr).toBeGreaterThan(0);
  });

  it('computes credit cost', () => {
    const metrics = computeInvestmentMetrics(baseApartment);
    expect(metrics.costTotalCredit).toBeGreaterThan(0);
  });
});
