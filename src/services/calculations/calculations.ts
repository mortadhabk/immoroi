import type { Apartment } from '../../models/apartment';

export type ApartmentMetrics = {
  purchaseTotal: number;
  acquisitionViaBank: number;
  loanAmount: number;
  annualRate: number;
  monthlyPayment: number;
  totalInterest: number;
  bankProfit: number;
  totalCostWithLoan: number;
  totalPlusWorks: number;
  totalCharges: number;
  totalRevenues: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  cashFlowYear: number;
  cashFlowMonth: number;
  gainBrutMensuel: number;
};

const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

export const resolveDefaultRate = (loanYears: number): number => {
  if (loanYears <= 10) return 0.025;
  if (loanYears <= 20) return 0.031;
  return 0.035;
};

export const pmt = (loanAmount: number, annualRate: number, loanYears: number): number => {
  const n = loanYears * 12;
  if (n <= 0 || loanAmount <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return loanAmount / n;
  const factor = Math.pow(1 + r, n);
  return loanAmount * ((r * factor) / (factor - 1));
};

export const calculateApartmentMetrics = (apartment: Apartment): ApartmentMetrics => {
  const purchaseTotal = apartment.purchasePrice + apartment.notaryFees + apartment.agencyFees;
  const acquisitionViaBank =
    purchaseTotal + apartment.bankFileFees + apartment.brokerFees + apartment.guaranteeFees;
  const loanAmount = Math.max(0, acquisitionViaBank - apartment.downPayment);
  const annualRate =
    apartment.annualInterestRate == null
      ? resolveDefaultRate(apartment.loanYears)
      : apartment.annualInterestRate;
  const monthlyPayment = pmt(loanAmount, annualRate, apartment.loanYears);
  const n = apartment.loanYears * 12;
  const totalInterest = n > 0 ? monthlyPayment * n - loanAmount : 0;
  const bankProfit = totalInterest + apartment.bankInsuranceTotal + apartment.bankFileFees + apartment.guaranteeFees;
  const totalCostWithLoan =
    apartment.downPayment + loanAmount + totalInterest + apartment.bankInsuranceTotal;
  const totalPlusWorks = acquisitionViaBank + apartment.worksCost;
  const totalCharges = apartment.charges.reduce((sum, c) => sum + c.amount, 0);
  const totalRevenues = apartment.revenues.reduce((sum, r) => sum + r.monthlyAmount * 12, 0);
  const grossYieldPercent = totalPlusWorks > 0 ? (totalRevenues / totalPlusWorks) * 100 : 0;
  const netYieldPercent =
    totalPlusWorks > 0 ? ((totalRevenues - totalCharges) / totalPlusWorks) * 100 : 0;
  const cashFlowYear = totalRevenues - totalCharges;
  const cashFlowMonth = cashFlowYear / 12;
  const gainBrutMensuel = cashFlowMonth - monthlyPayment;

  return {
    purchaseTotal: round2(purchaseTotal),
    acquisitionViaBank: round2(acquisitionViaBank),
    loanAmount: round2(loanAmount),
    annualRate,
    monthlyPayment: round2(monthlyPayment),
    totalInterest: round2(totalInterest),
    bankProfit: round2(bankProfit),
    totalCostWithLoan: round2(totalCostWithLoan),
    totalPlusWorks: round2(totalPlusWorks),
    totalCharges: round2(totalCharges),
    totalRevenues: round2(totalRevenues),
    grossYieldPercent: round2(grossYieldPercent),
    netYieldPercent: round2(netYieldPercent),
    cashFlowYear: round2(cashFlowYear),
    cashFlowMonth: round2(cashFlowMonth),
    gainBrutMensuel: round2(gainBrutMensuel),
  };
};

export const calculatePortfolioKpis = (apartments: Apartment[]) => {
  const totals = apartments.map(calculateApartmentMetrics);
  const totalRevenues = totals.reduce((s, m) => s + m.totalRevenues, 0);
  const totalCharges = totals.reduce((s, m) => s + m.totalCharges, 0);
  const cashFlowYear = totals.reduce((s, m) => s + m.cashFlowYear, 0);
  const totalMonthlyPayments = totals.reduce((s, m) => s + m.monthlyPayment, 0);
  const avgGrossYield =
    totals.length > 0 ? totals.reduce((s, m) => s + m.grossYieldPercent, 0) / totals.length : 0;
  const avgNetYield =
    totals.length > 0 ? totals.reduce((s, m) => s + m.netYieldPercent, 0) / totals.length : 0;

  return {
    totalRevenues: round2(totalRevenues),
    totalCharges: round2(totalCharges),
    cashFlowYear: round2(cashFlowYear),
    totalMonthlyPayments: round2(totalMonthlyPayments),
    avgGrossYield: round2(avgGrossYield),
    avgNetYield: round2(avgNetYield),
  };
};
