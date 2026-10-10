import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchStudyMaterials, fetchTutorials } from '@/services/api';
import StudyMaterialClient from '@/components/StudyMaterialClient';
import { StudyMaterial, TutorialItem } from '@/types';

export const revalidate = 3600; // Cache for 1 hour (ISR)

export const metadata: Metadata = {
  title: 'Study Material Hub: Tutorials, Cheatsheets & PDF Guides | MSK Institute',
  description: 'Access interactive coding tutorials, quick cheatsheets, downloadable PDF revision guides, and developer handbooks for Python, Web Development, CCC, and MS Office.',
  alternates: {
    canonical: 'https://www.mskinstitute.in/study-material',
  },
  openGraph: {
    title: 'Study Material Hub | MSK Institute',
    description: 'Explore free & premium tutorials, cheatsheets, PDF notes, and developer handbooks at MSK Institute, Shikohabad.',
    url: 'https://www.mskinstitute.in/study-material',
  },
};

export default async function StudyMaterialPage() {
  let materials: StudyMaterial[] = [];
  let tutorials: TutorialItem[] = [];
  let errorMsg = '';

  try {
    const [matRes, tutRes] = await Promise.all([
      fetchStudyMaterials(),
      fetchTutorials(),
    ]);
    materials = matRes || [];
    tutorials = tutRes || [];
  } catch (error) {
    console.error('Failed to load study materials:', error);
    errorMsg = 'Unable to load study materials repository. Please try again later.';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
          Student Resources Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
          Study Material Hub
        </h1>
        <p className="text-text-muted text-sm sm:text-lg leading-relaxed">
          Enhance your offline lab lectures with our curated tutorials, cheatsheets, PDF revision notes, and comprehensive handbooks.
        </p>
      </div>

      {errorMsg && materials.length === 0 && tutorials.length === 0 ? (
        <div className="text-center py-12 bg-red-50 text-red-700 border border-red-200 rounded-xl">
          <p className="font-semibold">{errorMsg}</p>
        </div>
      ) : (
        <StudyMaterialClient initialMaterials={materials} tutorials={tutorials} />
      )}
    </div>
  );
}
