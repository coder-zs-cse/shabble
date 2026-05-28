export const SITE_URL = 'https://shabble.xyz';

export const SITE_NAME = 'Shabble';

export const SITE_TITLE = 'Shabble - Daily Shape Guessing Puzzle Game';

export const SITE_DESCRIPTION =
  'Play Shabble, a daily shape guessing puzzle game where clues reveal how many hidden shape tiles surround each square. Solve the connected shape in as few hints as possible.';

export const SITE_KEYWORDS = [
  'Shabble',
  'daily puzzle game',
  'shape guessing game',
  'logic puzzle',
  'browser puzzle game',
  'Minesweeper inspired puzzle',
  'Waffle inspired puzzle',
  'daily brain teaser',
];

export const canonicalUrl = (path = '/') => new URL(path, SITE_URL).toString();

export const appJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      '@type': ['WebApplication', 'Game'],
      '@id': `${SITE_URL}/daily#game`,
      name: SITE_NAME,
      alternateName: 'Shabble Daily',
      url: canonicalUrl('/daily'),
      applicationCategory: 'GameApplication',
      applicationSubCategory: 'Puzzle game',
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
      genre: ['Logic puzzle', 'Daily puzzle', 'Shape guessing game'],
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      isAccessibleForFree: true,
      playMode: 'SinglePlayer',
      keywords: SITE_KEYWORDS.join(', '),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  ],
} as const;

export const aboutFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/about#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Shabble?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shabble is a daily browser puzzle game about finding a hidden connected shape on a grid.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do Shabble clues work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clicking a tile reveals how many hidden-shape tiles are in the surrounding 3 by 3 neighborhood, including the selected tile.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the goal of Shabble?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The goal is to identify the full hidden connected shape while preserving as many hints as possible.',
      },
    },
  ],
} as const;
