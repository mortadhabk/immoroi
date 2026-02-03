import type { Tour } from 'nextstepjs';

export const onboardingTours: Tour[] = [
  {
    tour: 'mainTour',
    steps: [
      {
        id: 'portfolio-card',
        title: 'Votre portefeuille',
        content: 'Ajoutez plusieurs biens et comparez leurs rendements.',
        selector: '#portfolio-first-card',
      },
      {
        id: 'add-apartment',
        title: 'Créer un bien',
        content: 'Créez un nouvel appartement en un clic.',
        selector: '#action-add-apt',
      },
      {
        id: 'compare-chart',
        title: 'Vue comparative',
        content: 'Comparez en un coup d’œil la rentabilité nette et le cashflow.',
        selector: '#chart-net-yield',
      },
    ],
  },
];
