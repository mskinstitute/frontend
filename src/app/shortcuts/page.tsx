import { Metadata } from 'next';
import ShortcutsHubClient from './ShortcutsHubClient';
import { SOFTWARE_TOOLS } from '@/data/shortcutsData';

export const metadata: Metadata = {
  title: 'Software & Tools Keyboard Shortcuts Hub | Cheatsheets | MSK Institute',
  description:
    'Complete keyboard shortcuts cheatsheets for MS Excel, Word, PowerPoint, VS Code, Windows 11, Google Chrome, Photoshop, Tally Prime, Git, and Linux. Fast searchable key combinations curated by MSK Institute.',
  keywords: [
    'Keyboard Shortcuts Hub',
    'Computer Shortcut Keys List',
    'MS Excel Shortcuts',
    'VS Code Keyboard Shortcuts',
    'Tally Prime Shortcut Keys',
    'MS Word Shortcuts Cheatsheet',
    'Photoshop Shortcut Keys',
    'Windows 11 Shortcuts',
    'Linux Terminal Shortcuts',
    'Computer Shortcuts Shikohabad',
    'MSK Institute Shortcuts',
    'CCC Keyboard Shortcuts',
    'ADCA Shortcut Keys',
  ],
  alternates: {
    canonical: 'https://www.mskinstitute.in/shortcuts',
  },
  openGraph: {
    title: 'Software & Tools Keyboard Shortcuts Hub | MSK Institute',
    description:
      'Complete computer keyboard shortcuts guide for MS Office, VS Code, Photoshop, Tally, Windows, Git, and Linux.',
    url: 'https://www.mskinstitute.in/shortcuts',
    siteName: 'MSK Institute',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.mskinstitute.in/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'MSK Institute Keyboard Shortcuts Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software & Tools Keyboard Shortcuts Hub | MSK Institute',
    description:
      'Master MS Excel, VS Code, Photoshop, Tally, and Windows with comprehensive shortcut cheatsheets.',
    images: ['https://www.mskinstitute.in/logo.jpg'],
  },
};

export default function ShortcutsPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Software Keyboard Shortcuts Cheatsheets Hub',
    description:
      'Comprehensive collection of computer software keyboard shortcuts curated by MSK Institute Shikohabad.',
    itemListElement: SOFTWARE_TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${tool.name} Keyboard Shortcuts`,
      url: `https://www.mskinstitute.in/shortcuts/${tool.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ShortcutsHubClient />
    </>
  );
}
