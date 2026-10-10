import { Metadata } from 'next';
import { fetchLiveBatches } from '@/services/api';
import LiveBatchesClient from '@/components/LiveBatchesClient';

export const metadata: Metadata = {
  title: "Upcoming Training Batches & Live Registrations | MSK Institute",
  description: "Enrol in our upcoming professional live coding batches. Reserve your seat for Python Programming, MERN Stack Web Development, and CCC in Shikohabad.",
  keywords: ["Computer Course Admissions", "Coding Batches Shikohabad", "Enroll in Python Course", "Web Dev Bootcamp Registration"],
};

export const revalidate = 60;

export default async function LiveBatchesPage() {
  const batches = await fetchLiveBatches();

  // Compile JSON-LD schema for scheduled batches
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.mskinstitute.in/live-batches",
        "url": "https://www.mskinstitute.in/live-batches",
        "name": "Upcoming Live Batches Admissions | MSK Institute",
        "description": "Enrollment query and details for upcoming web development and python programming live batches.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mskinstitute.in/#website",
          "url": "https://www.mskinstitute.in",
          "name": "MSK Institute"
        }
      },
      ...batches.map(b => ({
        "@type": "CourseInstance",
        "name": b.title,
        "description": b.description || b.title,
        "startDate": b.startDate,
        "courseMode": "Online & Offline Classroom",
        "instructor": {
          "@type": "Person",
          "name": b.instructor,
          "image": b.instructorPicture
        },
        "offers": {
          "@type": "Offer",
          "price": b.price.replace(/[^\d]/g, ''),
          "priceCurrency": "INR",
          "availability": b.status === 'COMPLETED' || b.status === 'ARCHIVED'
            ? "https://schema.org/Discontinued"
            : "https://schema.org/LimitedAvailability"
        }
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wider bg-[#B83A00]/10 text-[#B83A00]">
            Admissions Open • Live Batches
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">
            Upcoming Coding & Programming Batches
          </h1>
          <p className="text-text-muted text-lg">
            Choose from our structured training tracks. Register today to lock in your live seat, access training materials, and schedule your custom orientation session.
          </p>
        </div>

        <LiveBatchesClient batches={batches} />
      </div>
    </>
  );
}
