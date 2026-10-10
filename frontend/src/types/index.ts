export interface Course {
  id: string;
  status: 'PUBLISH' | 'DRAFT';
  title: string;
  slug: string;
  featuredImageUrl: string;
  shortDescription: string;
  categories: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Intermediate' | 'Beginner to Advanced' | 'Beginners to Advanced' | string;
  language: string[];
  duration: {
    value: number;
    unit: 'HOURS' | 'DAYS' | 'MONTHS';
  };
  certificate: boolean;
  mode: 'ONLINE' | 'OFFLINE' | 'BOTH';
  courseType: 'SINGLE' | 'COMBO';
  includedCourseIds?: string[];
  chapters?: Chapter[];
  learningOutcomes?: string[];
}

export interface Chapter {
  id: string;
  title: string;
  sortOrder: number;
  topics: ChapterTopic[];
}

export interface ChapterTopic {
  id: string;
  title: string;
  slug?: string;
  sortOrder: number;
  notes?: {
    title: string;
    url: string;
  }[];
  videos?: TopicVideo[];
}

export interface TopicVideo {
  id: string;
  title: string;
  url: string;
  preview: boolean;
}

export interface Student {
  studentId: string;
  name: string;
  username: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: string;
}

export interface Certificate {
  id: string; // e.g., MSK-2026-0001
  studentId: string;
  courseSlug: string;
  issueDate: string; // YYYY-MM-DD
  completionDate: string; // YYYY-MM-DD
  grade: string; // e.g. A+
  gradeLabel: string; // e.g. Outstanding
  status: 'valid' | 'revoked';
  instructor: string;
  organization: string;
}

export interface Note {
  id: string;
  title: string;
  category: string;
  description: string;
  tier: 'free' | 'paid';
  downloadUrl?: string;
  price?: string;
  topicsCovered: string[];
}

export type StudyMaterialType = 'tutorial' | 'cheatsheet' | 'note' | 'handbook';

export interface TutorialSection {
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface CheatsheetSection {
  categoryTitle: string;
  items: {
    commandOrSyntax: string;
    explanation: string;
    example?: string;
  }[];
}

export interface HandbookChapter {
  number: number;
  title: string;
  summary: string;
  keyPoints?: string[];
}

export interface TutorialSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface TutorialItem {
  id: string;
  slug: string;
  courseSlug: string;
  title?: string;
  icon?: string;
  badge?: string;
  tags?: string[];
  documentationTitle?: string;
  shortDescription?: string;
  lessonsCount?: number;
  totalHours?: string;
  topicsCount?: number;
  featured?: boolean;
  githubRepo?: string;
  updatedAt?: string;
  seo: TutorialSEO;
}

export interface TutorialTopicFrontmatter {
  id: string;
  slug: string;
  course: string;
  lesson?: string;
  chapter: number | string;
  topic: string;
  title: string;
  description: string;
  difficulty: string;
  readingTime: number;
  order: number;
  keywords?: string[];
  lastUpdated?: string;
  author?: string;
  version?: string;
}

export interface StudyMaterial {
  id: string;
  type: StudyMaterialType;
  title: string;
  slug?: string;
  category: string; // e.g. "Python", "Web Development", "JavaScript", "MS Office", "Cyber Security"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  tier: 'free' | 'paid';
  price?: string;
  downloadUrl?: string;
  topicsCovered: string[];
  readTime?: string;
  pages?: number;
  featured?: boolean;
  updatedAt: string;

  // Specific content payload for rich views
  tutorialContent?: {
    summary: string;
    prerequisites?: string[];
    steps: TutorialSection[];
    keyTakeaways: string[];
  };
  cheatsheetContent?: {
    sections: CheatsheetSection[];
  };
  handbookContent?: {
    chapters: HandbookChapter[];
    highlights: string[];
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string | {
    introduction?: string;
    sections?: {
      heading: string;
      body: string;
      codeSnippet?: string;
      codeLanguage?: string;
      callout?: string;
    }[];
    conclusion?: string;
  };
  relatedCourseSlugs?: string[];
}

export interface SearchResultItem {
  id: string;
  type: 'course' | 'live' | 'tutorial' | 'cheatsheet' | 'note' | 'handbook' | 'blog' | 'career' | 'chapter' | 'topic' | 'tool';
  title: string;
  description: string;
  category?: string;
  url: string;
  badge: string;
  actionLabel?: string;
}

export interface LiveClass {
  id: string;
  courseId?: string;
  liveBatcheId?: string;
  date: string; // YYYY-MM-DD e.g. "2026-09-01"
  startTime: string; // e.g. "04:30 PM"
  endTime: string; // e.g. "06:00 PM"
  joinUrl: string;
  chapter?: string;
  platform?: string; // Auto-deducted from joinUrl
  topics?: string[];

  // Auto-fetched / enriched properties from linked LiveBatch
  title?: string;
  description?: string;
  courseTitle?: string;
  courseSlug?: string;
  instructor?: string;
  instructorPicture?: string;
  instructorData?: Instructor;
  batchTitle?: string;
  durationMinutes?: number;
  offsetDays?: number;
  batch?: LiveBatch;
}

export interface Instructor {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  experience: string;
  picture: string;
  bio: string;
  specialties: string[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  rating?: number;
  studentsCount?: number;
}

export type BatchStatus = 'DRAFT' | 'UPCOMING' | 'OPEN' | 'FULL' | 'RUNNING' | 'COMPLETED' | 'CLOSED' | 'ARCHIVED';

export interface LiveBatch {
  id: string;
  courseSlug: string;
  courseId?: string;
  title: string;
  status?: BatchStatus;
  startDate: string; // e.g. "2026-09-15" or "15 September 2026"
  endDate?: string;
  startDateTime?: string; // e.g. "2026-09-20T17:00:00"
  schedule: string; // e.g. "Mon, Wed, Fri (04:30 PM - 06:00 PM)"
  mode?: 'ONLINE' | 'OFFLINE' | 'BOTH';
  instructorId?: string;
  instructor: string;
  instructorPicture: string;
  price: string;
  originalPrice?: string;
  totalSeats: number;
  leftSeats: number;
  // Branch & Multi-Location Relationship
  branchId?: string | null;
  branchSlug?: string;
  branchName?: string;
  // Optional enriched properties from Course, Instructor or legacy
  startDateOffsetDays?: number;
  courseTitle?: string;
  duration?: string;
  description?: string;
  instructorData?: Instructor;
}

export interface LeadSubmission {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  learningMode: 'OFFLINE' | 'ONLINE' | 'BOTH';
  batchId: string;
  batchTitle: string;
  courseTitle: string;
  price: string;
  branchId?: string;
  branchSlug?: string;
  branchName?: string;
  query?: string;
  submittedAt: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export type CareerType = 'internship' | 'job';
export type WorkMode = 'On-site' | 'Remote';

export interface CareerOpportunity {
  id: string;
  type: CareerType;
  title: string;
  department: string;
  category: string;
  location: string;
  workType: string;
  mode: WorkMode;
  stipendOrSalary: string;
  duration?: string;
  openings: number;
  experienceLevel: string;
  deadline?: string;
  featured?: boolean;
  active: boolean;
  priority?: 'High' | 'Medium' | 'Optional';
  gender?: string;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  perks: string[];
  postedAt: string;
  company?: string;
}

export interface CareerApplication {
  id?: string;
  careerId: string;
  careerTitle: string;
  careerType: CareerType;
  name: string;
  phone: string;
  email: string;
  city: string;
  qualification: string;
  collegeOrCompany?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverNote?: string;
  submittedAt: string;
}

// ============================================================================
// Multi-Branch & Franchise Architecture (Phase 5)
// ============================================================================

export type BranchStatus =
  | 'PLANNED'
  | 'COMING_SOON'
  | 'OPEN'
  | 'TEMPORARILY_CLOSED'
  | 'CLOSED'
  | 'ARCHIVED';

export type BranchType = 'CORPORATE' | 'FRANCHISE' | 'PARTNER';

export interface BranchOpeningHours {
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface BranchGalleryItem {
  url: string;
  alt: string;
  caption?: string;
}

export interface BranchFaq {
  question: string;
  answer: string;
}

export interface Branch {
  id: string; // e.g. "branch-shikohabad-001"
  code?: string; // e.g. "SKB-01"
  name: string; // e.g. "MSK Institute Shikohabad"
  displayName: string; // e.g. "Shikohabad Campus"
  slug: string; // e.g. "shikohabad"
  organizationId: string; // "msk-institute"
  city: string; // e.g. "Shikohabad"
  normalizedCity: string; // e.g. "shikohabad"
  state: string; // e.g. "Uttar Pradesh"
  country: string; // e.g. "India"
  countryCode: string; // "IN"
  postalCode: string; // "283135"
  address: string; // "Gali No. 3, Near Gyan Jyoti Public School"
  landmark?: string;
  latitude: number;
  longitude: number;
  phone: string; // "+918393042166"
  formattedPhone: string; // "+91 83930 42166"
  whatsapp: string; // "+918393042166"
  email: string; // "mskshikohabad@gmail.com"
  website: string; // "https://www.mskinstitute.in/locations/shikohabad"
  openingHours: BranchOpeningHours[];
  status: BranchStatus;
  branchType: BranchType;
  openingDate?: string;
  isHeadquarters?: boolean;
  franchise?: {
    enabled: boolean;
    partnerId?: string;
    partnerName?: string;
  };
  googleBusiness?: {
    profileUrl?: string;
    placeId?: string;
  };
  availableCourseIds: string[]; // List of Course.id or Course.slug values
  activeBatchIds: string[]; // List of LiveBatch.id values
  facultyIds?: string[];
  facilities?: string[];
  gallery?: BranchGalleryItem[];
  localDescription: string;
  localSeo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    indexable?: boolean;
  };
  faqs?: BranchFaq[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight branch summary for fast listings, city dropdowns, and cards
 */
export interface BranchSummary {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  city: string;
  state: string;
  postalCode: string;
  status: BranchStatus;
  branchType: BranchType;
  phone: string;
  formattedPhone: string;
  address: string;
  coursesCount: number;
  batchesCount: number;
  isHeadquarters?: boolean;
}

/**
 * Social Media & Community Trust Configuration Registry
 */
export interface SocialChannelConfig {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  followers: string;
  description: string;
  enabled: boolean;
  color?: string;
}

export interface GoogleReviewsConfig {
  rating: string;
  reviewCount: string;
  mapsUrl: string;
  label?: string;
  enabled: boolean;
}

export interface WhatsAppSupportConfig {
  phone: string;
  cleanNumber: string;
  defaultMessage: string;
  counselorName: string;
  enabled: boolean;
}

export interface SocialLinksRegistry {
  channels: SocialChannelConfig[];
  googleReviews: GoogleReviewsConfig;
  whatsAppSupport: WhatsAppSupportConfig;
  communityStats?: {
    studentsMentored?: string;
    activeLearners?: string;
    practicalRatio?: string;
    verifiedCertificates?: string;
  };
}

