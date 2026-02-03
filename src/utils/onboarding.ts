const INTRO_KEY = 'roi-intro-seen';
const TOUR_KEY = 'roi-tour-seen';

export const hasSeenIntro = () => localStorage.getItem(INTRO_KEY) === '1';
export const markIntroSeen = () => localStorage.setItem(INTRO_KEY, '1');

export const hasSeenTour = () => localStorage.getItem(TOUR_KEY) === '1';
export const markTourSeen = () => localStorage.setItem(TOUR_KEY, '1');
