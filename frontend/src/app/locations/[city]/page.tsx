import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';
import {
  getPublishedBranches,
  getBranchBySlug,
  getCoursesForBranch,
  getBatchesForBranch,
  generateBranchMetadata,
  generateBranchSchema,
  generateBranchBreadcrumbSchema,
} from '@/lib/branches';
import BranchHero from '@/components/branches/BranchHero';
import BranchCourses from '@/components/branches/BranchCourses';
import BranchBatches from '@/components/branches/BranchBatches';
import BranchFacilities from '@/components/branches/BranchFacilities';
import BranchContact from '@/components/branches/BranchContact';
import BranchFaqs from '@/components/branches/BranchFaqs';

interface BranchPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  const branches = await getPublishedBranches();
  return branches.map((branch) => ({
    city: branch.slug,
  }));
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const { city } = await params;
  const branch = await getBranchBySlug(city);
  if (!branch) {
    return {
      title: 'Campus Not Found | MSK Institute',
      description: 'The requested MSK Institute location could not be found.',
    };
  }
  return generateBranchMetadata(branch);
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { city } = await params;
  const branch = await getBranchBySlug(city);

  if (!branch || (branch.status !== 'OPEN' && branch.status !== 'COMING_SOON')) {
    notFound();
  }

  const [courses, batches, allBranches] = await Promise.all([
    getCoursesForBranch(branch.id),
    getBatchesForBranch(branch.id),
    getPublishedBranches(),
  ]);

  const otherBranches = allBranches.filter((b) => b.id !== branch.id);
  const branchSchema = generateBranchSchema(branch);
  const breadcrumbSchema = generateBranchBreadcrumbSchema(branch);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(branchSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Branch Hero Section */}
        <BranchHero branch={branch} />

        {/* Courses Available at Branch */}
        <BranchCourses courses={courses} branch={branch} />

        {/* Live Batches Scheduled at Branch */}
        <BranchBatches batches={batches} branch={branch} />

        {/* Facilities & Campus Amenities */}
        <BranchFacilities branch={branch} />

        {/* Contact, Timings & Interactive Map */}
        <BranchContact branch={branch} />

        {/* Local FAQs */}
        {branch.faqs && branch.faqs.length > 0 && (
          <BranchFaqs faqs={branch.faqs} branch={branch} />
        )}

        {/* Cross-Link Other Campuses */}
        {otherBranches.length > 0 && (
          <section className="py-12 bg-background-alt border-t border-border-subtle">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-secondary text-xs font-bold uppercase tracking-wider">
                Explore More Campuses
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary mt-1 mb-6">
                Other MSK Institute Locations
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {otherBranches.map((other) => (
                  <Link
                    key={other.id}
                    href={`/locations/${other.slug}`}
                    className="inline-flex items-center gap-2 bg-surface hover:bg-white text-text-primary hover:text-secondary px-4 py-2.5 rounded-xl border border-border-subtle hover:border-secondary/40 shadow-2xs transition-all text-xs font-semibold"
                  >
                    <Building2 className="w-3.5 h-3.5 text-secondary" />
                    <span>{other.name} ({other.city})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary-light transition-colors"
                >
                  <span>View All Locations</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
