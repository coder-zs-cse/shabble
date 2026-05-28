import type { Metadata } from 'next';
import Link from 'next/link';
import { aboutFaqJsonLd, canonicalUrl, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description:
    'Learn what Shabble is, how the daily shape guessing puzzle works, and why its clue mechanics combine logic, spatial reasoning, and quick daily play.',
  alternates: {
    canonical: canonicalUrl('/about'),
  },
};

const faqItems = [
  {
    question: 'What is Shabble?',
    answer:
      'Shabble is a daily browser puzzle game about finding a hidden connected shape on a grid.',
  },
  {
    question: 'How do the clues work?',
    answer:
      'When you click a tile, Shabble reveals how many hidden-shape tiles are in the surrounding 3 by 3 neighborhood, including the tile you selected.',
  },
  {
    question: 'What is the goal?',
    answer:
      'The goal is to identify the full hidden shape while using as few hints as possible.',
  },
  {
    question: 'What games inspired Shabble?',
    answer:
      'Shabble is inspired by daily logic games and clue-based deduction games, especially the spatial reasoning of Minesweeper and the daily puzzle rhythm of Waffle.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-10 text-gray-950 dark:bg-[#1a1a2e] dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }}
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <Link href="/daily" className="text-sm font-bold text-green-700 dark:text-green-300">
            Play Shabble
          </Link>
          <h1 className="text-4xl font-black">About Shabble</h1>
          <p className="text-lg leading-8 text-gray-700 dark:text-gray-200">
            Shabble is a daily shape guessing puzzle game. Each puzzle hides a
            connected shape on a square grid, and every clue helps you infer
            which tiles belong to that shape.
          </p>
        </header>

        <section className="flex flex-col gap-4" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-2xl font-extrabold">
            How Shabble Works
          </h2>
          <p className="leading-7 text-gray-700 dark:text-gray-200">
            Players reveal numeric clues by selecting tiles. A clue tells you
            how many hidden-shape tiles exist around that tile in its immediate
            3 by 3 neighborhood. Use those local counts to reconstruct the full
            continuous shape before your hints run out.
          </p>
          <p className="leading-7 text-gray-700 dark:text-gray-200">
            The game refreshes with a new daily puzzle and supports multiple
            board sizes, making it a compact logic challenge for players who
            enjoy deduction, spatial reasoning, and daily puzzle streaks.
          </p>
        </section>

        <section className="flex flex-col gap-4" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-extrabold">
            FAQ
          </h2>
          <div className="flex flex-col gap-5">
            {faqItems.map((item) => (
              <article key={item.question} className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">{item.question}</h3>
                <p className="leading-7 text-gray-700 dark:text-gray-200">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
