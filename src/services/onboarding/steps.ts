import type { Tour } from 'nextstepjs';

export const onboardingTours: Tour[] = [
  {
    tour: 'mainTour',
    steps: [
      {
        icon: null,
        title: 'Votre portefeuille',
        content: 'Ajoutez plusieurs biens et comparez leurs rendements.',
        selector: '#portfolio-first-card',
      },
      {
        icon: null,
        title: 'Créer un bien',
        content: 'Créez un nouvel appartement en un clic.',
        selector: '#action-add-apt',
      },
      {
        icon: null,
        title: 'Vue comparative',
        content: 'Comparez en un coup d’œil la rentabilité nette et le cashflow.',
        selector: '#chart-net-yield',
      },
    ],
  },
];
