import { Course, Certificate, Student, Note, LiveClass, LiveBatch, Instructor, StudyMaterial, BlogPost, TutorialItem, TutorialTopicFrontmatter, CareerOpportunity, Branch, SocialLinksRegistry } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Server-side lazy bundled JSON loader: zero-IO on Node/Serverless while keeping client bundles clean
async function loadServerData<T>(fileName: string): Promise<T> {
  switch (fileName) {
    case 'all-courses.json':
      return (await import('../../public/data/all-courses.json')).default as unknown as T;
    case 'study-materials.json':
      return (await import('../../public/data/study-materials.json')).default as unknown as T;
    case 'tutorials.json':
      return (await import('../../public/data/tutorials.json')).default as unknown as T;
    case 'careers.json':
      return (await import('../../public/data/careers.json')).default as unknown as T;
    case 'certificates.json':
      return (await import('../../public/data/certificates.json')).default as unknown as T;
    case 'instructors.json':
      return (await import('../../public/data/instructors.json')).default as unknown as T;
    case 'notes.json':
      return (await import('../../public/data/notes.json')).default as unknown as T;
    case 'announcements.json':
      return (await import('../../public/data/announcements.json')).default as unknown as T;
    case 'branches.json':
      return (await import('../../public/data/branches.json')).default as unknown as T;
    case 'social-links.json':
      return (await import('../../public/data/social-links.json')).default as unknown as T;
    default:
      throw new Error(`Unsupported data file: ${fileName}`);
  }
}

// Helper to safely load local data in any environment (Serverless lambda, Node SSR, build-time SSG, or browser client)
async function getLocalData<T>(fileName: string): Promise<T> {
  // 1. Running on server: use zero-IO static bundled loader
  if (typeof window === 'undefined') {
    return loadServerData<T>(fileName);
  }

  // 2. Running on client: fetch relative path without bundling 1.2MB JSON into client bundle
  try {
    const url = `/data/${fileName}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${fileName}`);
    return (await res.json()) as T;
  } catch (clientErr) {
    console.warn(`Could not fetch /data/${fileName} from client:`, clientErr);
    throw clientErr;
  }
}

export async function fetchCareers(): Promise<CareerOpportunity[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/careers/`, { next: { revalidate: 1800 } });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch careers failed, falling back to local data:', err);
    }
  }
  return getLocalData<CareerOpportunity[]>('careers.json');
}

export async function fetchCareerById(id: string): Promise<CareerOpportunity | null> {
  const careers = await fetchCareers();
  const normalized = id.trim().toLowerCase();
  return careers.find(c => c.id.toLowerCase() === normalized) || null;
}

export async function fetchCourses(): Promise<Course[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/`, { next: { revalidate: 3600 } });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch courses failed, falling back to local data:', err);
    }
  }
  return getLocalData<Course[]>('all-courses.json');
}

export async function fetchTutorials(): Promise<TutorialItem[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tutorials/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch tutorials failed, falling back to local data:', err);
    }
  }
  return getLocalData<TutorialItem[]>('tutorials.json');
}

export async function fetchTutorialBySlug(slug: string): Promise<{ tutorial: TutorialItem; course: Course } | null> {
  const [tutorials, courses] = await Promise.all([
    fetchTutorials(),
    fetchCourses(),
  ]);

  const normalized = slug.toLowerCase().trim();
  const tutorial = tutorials.find(
    (t) =>
      t.slug.toLowerCase() === normalized ||
      t.id.toLowerCase() === normalized ||
      (normalized === 'html5-complete-masterclass' && t.slug === 'html5-complete-course')
  );
  if (!tutorial) return null;

  // Match course by courseSlug or by keyword
  const course =
    courses.find((c) => tutorial.courseSlug && c.slug?.toLowerCase() === tutorial.courseSlug.toLowerCase()) ||
    courses.find((c) => c.title?.toLowerCase().includes(tutorial.title?.toLowerCase() || '')) ||
    courses[0];

  return { tutorial, course };
}

export async function fetchCertificateById(id: string): Promise<Certificate | null> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/${id}/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch certificate failed, falling back to local data:', err);
    }
  }
  const certificates = await getLocalData<Certificate[]>('certificates.json');
  return certificates.find(c => c.id.trim().toLowerCase() === id.trim().toLowerCase()) || null;
}

export const DEFAULT_GOOGLE_SHEET_STUDENTS_URL =
  'https://docs.google.com/spreadsheets/d/1IMLDtXqnuM1A35xpboR_IrcYh5563ZCy55dzl1vGW1A/edit#gid=1837311274';

export const FALLBACK_STUDENTS: Student[] = [
  {
    studentId: 'std-001',
    name: 'Rahul Kumar',
    username: 'rahulkumar',
    email: 'rahul.kumar@email.com',
    status: 'ACTIVE',
    joinedAt: '2026-02-10',
  },
  {
    studentId: 'std-002',
    name: 'Priya Sharma',
    username: 'priyasharma',
    email: 'priya.sharma@email.com',
    status: 'ACTIVE',
    joinedAt: '2026-02-15',
  },
  {
    studentId: 'std-003',
    name: 'Amit Singh',
    username: 'amitsingh',
    email: 'amit.singh@email.com',
    status: 'INACTIVE',
    joinedAt: '2026-03-01',
  },
];

export function parseGoogleSheetStudentsCsv(csvText: string): Student[] {
  if (!csvText || typeof csvText !== 'string') return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell);
      if (currentRow.some((c) => c.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some((c) => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length <= 1) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const headerMap: Record<string, number> = {};

  headers.forEach((header, idx) => {
    if (
      header === 'studentid' ||
      header === 'id' ||
      header === 'rollno' ||
      header === 'roll' ||
      header === 'regno' ||
      header === 'registrationno' ||
      header === 'enrollmentno'
    ) {
      headerMap['studentId'] = idx;
    } else if (
      header === 'name' ||
      header === 'studentname' ||
      header === 'fullname' ||
      header === 'candidatename'
    ) {
      headerMap['name'] = idx;
    } else if (header === 'username' || header === 'user') {
      headerMap['username'] = idx;
    } else if (header === 'email' || header === 'emailid' || header === 'mail') {
      headerMap['email'] = idx;
    } else if (header === 'status') {
      headerMap['status'] = idx;
    } else if (
      header === 'joinedat' ||
      header === 'joiningdate' ||
      header === 'admissiondate' ||
      header === 'date'
    ) {
      headerMap['joinedAt'] = idx;
    }
  });

  const parsedStudents: Student[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (key: string): string => {
      const idx = headerMap[key];
      if (idx !== undefined && idx < row.length) {
        return row[idx].trim();
      }
      return '';
    };

    const studentId = getVal('studentId') || (row[0] ? row[0].trim() : '');
    const name = getVal('name') || (row[1] ? row[1].trim() : '');
    const username = getVal('username') || (row[2] ? row[2].trim() : studentId.toLowerCase());
    const email = getVal('email') || (row[3] ? row[3].trim() : '');
    const statusVal = getVal('status') || (row[4] ? row[4].trim() : 'ACTIVE');
    const joinedAt = getVal('joinedAt') || (row[5] ? row[5].trim() : new Date().toISOString().split('T')[0]);

    if (!studentId && !name) continue;

    parsedStudents.push({
      studentId,
      name,
      username: username || studentId.toLowerCase(),
      email,
      status: statusVal.toUpperCase().includes('INACT') ? 'INACTIVE' : 'ACTIVE',
      joinedAt,
    });
  }

  return parsedStudents;
}

export async function fetchStudents(): Promise<Student[]> {
  const sheetUrl =
    process.env.GOOGLE_SHEET_STUDENTS_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_STUDENTS_URL ||
    DEFAULT_GOOGLE_SHEET_STUDENTS_URL;

  try {
    const csvUrl = formatGoogleSheetCsvUrl(sheetUrl, { gid: '1837311274', sheet: 'students' });
    const res = await fetch(csvUrl, { next: { revalidate: 60 } });
    if (res.ok) {
      const csvText = await res.text();
      const parsed = parseGoogleSheetStudentsCsv(csvText);
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('API fetch students from Google Sheet failed, falling back:', err);
  }

  return FALLBACK_STUDENTS;
}

export async function fetchStudentById(studentId: string): Promise<Student | null> {
  if (!studentId) return null;
  const cleanId = studentId.trim().toLowerCase();

  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${encodeURIComponent(studentId)}/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch student failed:', err);
    }
  }

  const students = await fetchStudents();
  return (
    students.find(
      (s) =>
        s.studentId.trim().toLowerCase() === cleanId ||
        s.username.trim().toLowerCase() === cleanId ||
        s.email.trim().toLowerCase() === cleanId
    ) || null
  );
}

export async function fetchNotes(): Promise<Note[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notes/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch notes failed, falling back to local data:', err);
    }
  }
  return getLocalData<Note[]>('notes.json');
}

export async function fetchStudyMaterials(): Promise<StudyMaterial[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/study-materials/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch study materials failed, falling back to local data:', err);
    }
  }
  return getLocalData<StudyMaterial[]>('study-materials.json');
}

export async function fetchStudyMaterialById(idOrSlug: string): Promise<StudyMaterial | null> {
  const materials = await fetchStudyMaterials();
  const normalized = idOrSlug.trim().toLowerCase();
  return materials.find(m => m.id.toLowerCase() === normalized || (m.slug && m.slug.toLowerCase() === normalized)) || null;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  // If running on server (SSR/SSG/ISR), read directly from content/blogs/*.md
  if (typeof window === 'undefined') {
    try {
      const { getAllBlogPosts } = await import('@/lib/server-blogs');
      const posts = await getAllBlogPosts();
      if (posts && posts.length > 0) return posts;
    } catch (serverErr) {
      console.warn('Server fetch blogs from content/blogs failed:', serverErr);
    }
  }

  // If external API URL is configured
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch blogs failed:', err);
    }
  }

  // Client-side fetch to local /api/blogs endpoint
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Client fetch /api/blogs failed:', err);
    }
  }

  return [];
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  const normalized = slug.trim().toLowerCase();

  // If running on server, lookup directly from content/blogs markdown files
  if (typeof window === 'undefined') {
    try {
      const { getBlogPostBySlug } = await import('@/lib/server-blogs');
      const post = await getBlogPostBySlug(normalized);
      if (post) return post;
    } catch (serverErr) {
      console.warn('Server fetch blog by slug failed:', serverErr);
    }
  }

  const blogs = await fetchBlogs();
  return blogs.find(b => b.slug.toLowerCase() === normalized || b.id.toLowerCase() === normalized) || null;
}

export async function fetchInstructors(): Promise<Instructor[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/instructors/`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API fetch instructors failed, falling back to local data:', err);
    }
  }
  return getLocalData<Instructor[]>('instructors.json');
}

export async function fetchInstructorById(id: string): Promise<Instructor | null> {
  const instructors = await fetchInstructors();
  return instructors.find(i => i.id.toLowerCase() === id.toLowerCase() || i.name.toLowerCase() === id.toLowerCase()) || null;
}

export const DEFAULT_GOOGLE_SHEET_LIVE_BATCHES_URL =
  'https://docs.google.com/spreadsheets/d/1IMLDtXqnuM1A35xpboR_IrcYh5563ZCy55dzl1vGW1A/edit?gid=1194716609#gid=1194716609';

// In-memory cache to ensure sub-millisecond response & resilience if Google Sheets is briefly unreachable
let cachedBatches: LiveBatch[] = [];
let lastBatchesFetchTime = 0;
const BATCHES_CACHE_TTL_MS = 30 * 1000; // 30 seconds memory cache

export async function fetchLiveBatches(): Promise<LiveBatch[]> {
  const now = Date.now();

  // Return cached result if within in-memory TTL
  if (cachedBatches.length > 0 && now - lastBatchesFetchTime < BATCHES_CACHE_TTL_MS) {
    return cachedBatches;
  }

  let rawBatches: LiveBatch[] = [];

  // 1. Fetch live batches directly from Google Sheet (Batches tab)
  const sheetUrl =
    process.env.GOOGLE_SHEET_LIVE_BATCHES_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_LIVE_BATCHES_URL ||
    DEFAULT_GOOGLE_SHEET_LIVE_BATCHES_URL;

  if (sheetUrl) {
    try {
      const csvUrl = formatGoogleSheetCsvUrl(sheetUrl, { gid: '1194716609', sheet: 'Batches' });
      const res = await fetch(csvUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const csvText = await res.text();
        // Check if returned CSV is valid (not HTML error or sign-in page)
        if (!csvText.trim().startsWith('<!DOCTYPE html') && !csvText.trim().startsWith('<html')) {
          const parsed = parseGoogleSheetBatchesCsv(csvText);
          if (parsed.length > 0) {
            rawBatches = parsed;
          }
        }
      }
    } catch (sheetErr) {
      console.warn('API fetch live batches from Google Sheet failed:', sheetErr);
    }
  }

  // 2. Fallback to API if empty
  if (rawBatches.length === 0 && API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/live-batches/`);
      if (res.ok) {
        rawBatches = await res.json();
      }
    } catch (err) {
      console.warn('API fetch live batches failed:', err);
    }
  }

  // 3. Fallback to existing memory cache if current network fetch failed
  if (rawBatches.length === 0 && cachedBatches.length > 0) {
    return cachedBatches;
  }

  // 4. Enrich batches with course data, instructor data, and calculated lifecycle status
  const [courses, instructors] = await Promise.all([
    getLocalData<Course[]>('all-courses.json'),
    fetchInstructors().catch(() => [] as Instructor[]),
  ]);

  const enrichedBatches = rawBatches.map((batch) => {
    const lookupKey = (batch.courseSlug || batch.courseId || batch.id).toLowerCase();
    const matchedCourse = courses.find(
      (c) =>
        c.slug.toLowerCase() === lookupKey ||
        c.id.toLowerCase() === lookupKey ||
        c.slug.toLowerCase() === (batch.courseSlug || '').toLowerCase()
    );
    const matchedInstructor = instructors.find(
      (inst) => inst.id === batch.instructorId || inst.name.toLowerCase() === batch.instructor?.toLowerCase()
    );

    // Compute lifecycle status
    const startTs = getBatchStartTimestamp(batch);
    let status = batch.status || 'OPEN';
    if (batch.status && ['COMPLETED', 'ARCHIVED', 'CLOSED', 'DRAFT'].includes(batch.status)) {
      status = batch.status;
    } else if (batch.leftSeats <= 0) {
      status = 'FULL';
    } else if (batch.endDate && new Date(batch.endDate).getTime() < now) {
      status = 'COMPLETED';
    } else if (startTs > 0 && startTs < now - (75 * 24 * 60 * 60 * 1000)) {
      status = 'COMPLETED';
    } else if (startTs > now) {
      status = batch.status || 'OPEN';
    }

    return {
      ...batch,
      status,
      courseTitle: matchedCourse?.title || batch.courseTitle || batch.title,
      courseSlug: matchedCourse?.slug || batch.courseSlug || lookupKey,
      duration: matchedCourse ? `${matchedCourse.duration.value} ${matchedCourse.duration.unit}` : batch.duration || '3 Months',
      description: matchedCourse?.shortDescription || batch.description || '',
      instructor: matchedInstructor?.name || batch.instructor || 'Er. Sumit Kumar',
      instructorPicture: matchedInstructor?.picture || batch.instructorPicture || '/logo.jpg',
      instructorData: matchedInstructor,
    };
  });

  if (enrichedBatches.length > 0) {
    cachedBatches = enrichedBatches;
    lastBatchesFetchTime = now;
  }

  return enrichedBatches;
}

export async function fetchLiveBatchById(id: string): Promise<{ batch: LiveBatch; course: Course | null; includedCourses: Course[]; instructor: Instructor | null } | null> {
  const [allBatches, allCourses, allInstructors] = await Promise.all([
    fetchLiveBatches(),
    fetchCourses(),
    fetchInstructors().catch(() => [] as Instructor[]),
  ]);

  const normalized = id.toLowerCase().trim();
  const cleanId = normalized.replace(/[^a-z0-9]+/g, '-');

  const batch = allBatches.find((b) => {
    const bId = b.id.toLowerCase();
    const bClean = bId.replace(/[^a-z0-9]+/g, '-');
    const bSlug = (b.courseSlug || '').toLowerCase();
    const bCourseId = (b.courseId || '').toLowerCase();

    return (
      bId === normalized ||
      bClean === cleanId ||
      bSlug === normalized ||
      bCourseId === normalized ||
      (cleanId.includes('python-mastery') && bClean.includes('python-mastery')) ||
      (cleanId.includes('data-analysis') && bClean.includes('data-analysis')) ||
      (cleanId.includes('mern') && bClean.includes('mern'))
    );
  });

  if (!batch) return null;

  const course = allCourses.find((c) => c.slug.toLowerCase() === batch.courseSlug.toLowerCase() || c.id.toLowerCase() === batch.courseSlug.toLowerCase()) || null;
  const isCombo = course?.courseType === 'COMBO';
  const includedCourses: Course[] = isCombo && course?.includedCourseIds
    ? course.includedCourseIds
        .map((cId) => allCourses.find((c) => c.id === cId))
        .filter((c): c is Course => Boolean(c))
    : [];

  const instructor = allInstructors.find(
    (inst) => inst.id === batch.instructorId || inst.name.toLowerCase() === batch.instructor.toLowerCase()
  ) || batch.instructorData || null;

  return { batch, course, includedCourses, instructor };
}

export function deductPlatformFromUrl(url?: string): string {
  if (!url) return 'MSK Live';
  const lower = url.toLowerCase();
  if (lower.includes('meet.google.com')) return 'Google Meet';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube Live';
  if (lower.includes('zoom.us') || lower.includes('zoom.com')) return 'Zoom';
  if (lower.includes('teams.microsoft.com') || lower.includes('teams.live.com')) return 'Microsoft Teams';
  return 'MSK Live';
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [timeVal, modifier] = timeStr.trim().split(' ');
  let [hours, minutes] = (timeVal || '0:0').split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return (hours || 0) * 60 + (minutes || 0);
}

export function calculateDurationMinutes(startTime?: string, endTime?: string): number {
  if (!startTime || !endTime) return 60;
  try {
    const start = parseTimeToMinutes(startTime);
    const end = parseTimeToMinutes(endTime);
    const diff = end - start;
    return diff > 0 ? diff : 60;
  } catch {
    return 60;
  }
}

export function formatGoogleSheetCsvUrl(rawUrl: string, defaultOptions?: { gid?: string; sheet?: string }): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // If already a Google Visualization CSV export url
  if (trimmed.includes('tqx=out:csv')) {
    return trimmed;
  }

  // If standard Google Sheet edit or share link
  // e.g. https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const sheetMatch = trimmed.match(/[#&?]sheet=([^&#]+)/);

    if (gidMatch && gidMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gidMatch[1]}`;
    }
    if (sheetMatch && sheetMatch[1]) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetMatch[1]}`;
    }
    if (defaultOptions?.gid) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${defaultOptions.gid}`;
    }
    if (defaultOptions?.sheet) {
      return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(defaultOptions.sheet)}`;
    }
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  // If just the ID is provided
  if (!trimmed.includes('/') && trimmed.length > 20) {
    const extra = defaultOptions?.gid ? `&gid=${defaultOptions.gid}` : defaultOptions?.sheet ? `&sheet=${encodeURIComponent(defaultOptions.sheet)}` : '';
    return `https://docs.google.com/spreadsheets/d/${trimmed}/gviz/tq?tqx=out:csv${extra}`;
  }

  return trimmed;
}

export function parseStartDateTime(dateTimeStr?: string): {
  dateStr: string;
  isoString: string;
  timestamp: number;
} {
  if (!dateTimeStr) {
    const fallback = new Date();
    return {
      dateStr: fallback.toISOString().split('T')[0],
      isoString: fallback.toISOString(),
      timestamp: fallback.getTime(),
    };
  }

  const trimmed = dateTimeStr.trim();
  let parsedDate = new Date(trimmed);

  // Check if format like "YYYY-MM-DD hh:mm AM/PM" or "YYYY-MM-DD HH:mm"
  if (isNaN(parsedDate.getTime())) {
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (match) {
      const [, ymd, hStr, mStr, , ampm] = match;
      let hours = parseInt(hStr, 10);
      const minutes = parseInt(mStr, 10);
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      parsedDate = new Date(`${ymd}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
    } else {
      const alt = new Date(trimmed.replace(/\//g, '-'));
      if (!isNaN(alt.getTime())) {
        parsedDate = alt;
      }
    }
  }

  if (isNaN(parsedDate.getTime())) {
    parsedDate = new Date();
  }

  const y = parsedDate.getFullYear();
  const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const d = String(parsedDate.getDate()).padStart(2, '0');

  return {
    dateStr: `${y}-${m}-${d}`,
    isoString: parsedDate.toISOString(),
    timestamp: parsedDate.getTime(),
  };
}

export function getBatchStartTimestamp(batch: LiveBatch): number {
  if (batch.startDateTime) {
    const ts = new Date(batch.startDateTime).getTime();
    if (!isNaN(ts)) return ts;
  }

  if (batch.startDate) {
    let timePart = '09:00 AM';
    if (batch.schedule) {
      const timeMatch = batch.schedule.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (timeMatch) timePart = timeMatch[1];
    }
    const [hVal, mVal] = timePart.split(':');
    const [mins, ampm] = (mVal || '00 AM').trim().split(' ');
    let hours = parseInt(hVal, 10) || 9;
    const minutes = parseInt(mins, 10) || 0;
    if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const [year, month, day] = batch.startDate.split('-').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day, hours, minutes, 0).getTime();
    }
    const d = new Date(batch.startDate).getTime();
    if (!isNaN(d)) return d;
  }

  return 0;
}

export function parseGoogleSheetBatchesCsv(csvText: string): LiveBatch[] {
  if (!csvText || typeof csvText !== 'string') return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const rawHeaders = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const headerMap: Record<string, number> = {};

  rawHeaders.forEach((header, idx) => {
    if (header === 'id' || header === 'batchid') {
      headerMap['id'] = idx;
    } else if (header === 'courseid' || header === 'courseslug' || header === 'course' || header === 'slug') {
      headerMap['courseId'] = idx;
    } else if (header === 'title' || header === 'batchtitle' || header === 'name') {
      headerMap['title'] = idx;
    } else if (header === 'status' || header === 'batchstatus') {
      headerMap['status'] = idx;
    } else if (
      header === 'startdatetime' ||
      header === 'startdate' ||
      header === 'datetime' ||
      header === 'date' ||
      header === 'starts'
    ) {
      headerMap['startDateTime'] = idx;
    } else if (header === 'enddatetime' || header === 'enddate' || header === 'ends') {
      headerMap['endDate'] = idx;
    } else if (header === 'schedule' || header === 'timing' || header === 'time' || header === 'days') {
      headerMap['schedule'] = idx;
    } else if (header === 'mode' || header === 'trainingmode' || header === 'batchmode') {
      headerMap['mode'] = idx;
    } else if (header === 'instructorid' || header === 'mentorid') {
      headerMap['instructorId'] = idx;
    } else if (header === 'instructor' || header === 'instructorname' || header === 'mentor' || header === 'teacher') {
      headerMap['instructor'] = idx;
    } else if (header === 'instructorpicture' || header === 'picture' || header === 'image' || header === 'photo') {
      headerMap['instructorPicture'] = idx;
    } else if (header === 'price' || header === 'fee' || header === 'cost') {
      headerMap['price'] = idx;
    } else if (header === 'originalprice' || header === 'mrp' || header === 'strikeprice') {
      headerMap['originalPrice'] = idx;
    } else if (header === 'totalseats' || header === 'seats' || header === 'total') {
      headerMap['totalSeats'] = idx;
    } else if (header === 'leftseats' || header === 'remainingseats' || header === 'availableseats' || header === 'available') {
      headerMap['leftSeats'] = idx;
    } else if (header === 'branchid') {
      headerMap['branchId'] = idx;
    } else if (header === 'branchslug') {
      headerMap['branchSlug'] = idx;
    } else if (header === 'branchname' || header === 'branch' || header === 'location') {
      headerMap['branchName'] = idx;
    }
  });

  const parsedBatches: LiveBatch[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (key: string): string => {
      const idx = headerMap[key];
      if (idx !== undefined && idx < row.length) {
        return row[idx].trim();
      }
      return '';
    };

    const explicitId = getVal('id');
    const courseId = getVal('courseId');
    const title = getVal('title');
    const statusVal = getVal('status').toUpperCase();
    const startDateTimeRaw = getVal('startDateTime');
    const endDateRaw = getVal('endDate');
    const schedule = getVal('schedule');
    const modeVal = getVal('mode').toUpperCase();
    const instructorId = getVal('instructorId');
    const instructorName = getVal('instructor');
    const instructorPicture = getVal('instructorPicture');
    const price = getVal('price');
    const originalPrice = getVal('originalPrice');
    const totalSeats = getVal('totalSeats');
    const leftSeats = getVal('leftSeats');
    const branchId = getVal('branchId');
    const branchSlug = getVal('branchSlug');
    const branchName = getVal('branchName');

    // Skip empty rows
    if (!courseId && !title && !startDateTimeRaw && !explicitId) continue;

    const parsedDT = parseStartDateTime(startDateTimeRaw);
    
    // Determine batch ID cleanly
    let batchId = explicitId;
    if (!batchId) {
      const cleanKey = (courseId || title || `batch-${r}`)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      batchId = cleanKey.startsWith('batch-') ? cleanKey : `batch-${cleanKey}`;
    }

    // Determine batch mode
    let mode: 'ONLINE' | 'OFFLINE' | 'BOTH' = 'BOTH';
    if (modeVal === 'ONLINE' || modeVal === 'OFFLINE' || modeVal === 'BOTH') {
      mode = modeVal;
    }

    // Determine status if explicitly specified
    let status: import('@/types').BatchStatus | undefined = undefined;
    if (['OPEN', 'UPCOMING', 'FULL', 'RUNNING', 'COMPLETED', 'CLOSED', 'ARCHIVED', 'DRAFT'].includes(statusVal)) {
      status = statusVal as import('@/types').BatchStatus;
    }

    // Parse seats safely
    const parsedTotalSeats = parseInt(totalSeats.replace(/[^\d]/g, ''), 10);
    const parsedLeftSeats = parseInt(leftSeats.replace(/[^\d]/g, ''), 10);

    // Format price with INR symbol if missing
    const formatPrice = (p: string, fallback: string): string => {
      const val = p.trim();
      if (!val) return fallback;
      return val.startsWith('₹') ? val : `₹${val}`;
    };

    parsedBatches.push({
      id: batchId,
      courseSlug: courseId || '',
      courseId: courseId ? (courseId.startsWith('course-') ? courseId : `course-${courseId}`) : '',
      title: title || 'Live Interactive Batch',
      status,
      startDate: parsedDT.dateStr,
      endDate: endDateRaw || undefined,
      startDateTime: parsedDT.isoString,
      schedule: schedule || 'Mon - Sat (05:00 PM - 06:30 PM)',
      mode,
      branchId: branchId || 'branch-shikohabad-001',
      branchSlug: branchSlug || 'shikohabad',
      branchName: branchName || 'MSK Institute Shikohabad',
      instructorId: instructorId || 'sumit-kumar',
      instructor: instructorName || 'Er. Sumit Kumar',
      instructorPicture: instructorPicture || '/assets/img/instructors/sumit-kumar.webp',
      price: formatPrice(price, '₹4,999'),
      originalPrice: formatPrice(originalPrice, '₹9,999'),
      totalSeats: !isNaN(parsedTotalSeats) && parsedTotalSeats > 0 ? parsedTotalSeats : 20,
      leftSeats: !isNaN(parsedLeftSeats) ? parsedLeftSeats : 18,
    });
  }

  return parsedBatches;
}

export function parseGoogleSheetCsv(csvText: string): LiveClass[] {
  if (!csvText || typeof csvText !== 'string') return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in \r\n
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // Parse headers - support courseid, date, starttime, endtime, joinurl, chapter
  const rawHeaders = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const headerMap: Record<string, number> = {};

  rawHeaders.forEach((header, idx) => {
    if (header === 'id') {
      headerMap['id'] = idx;
    } else if (
      header === 'courseid' ||
      header === 'course' ||
      header === 'courseslug' ||
      header === 'livebatcheid' ||
      header === 'livebatchid' ||
      header === 'batchid' ||
      header === 'batch'
    ) {
      headerMap['courseId'] = idx;
    } else if (header === 'date') {
      headerMap['date'] = idx;
    } else if (header === 'starttime' || header === 'start') {
      headerMap['startTime'] = idx;
    } else if (header === 'endtime' || header === 'end') {
      headerMap['endTime'] = idx;
    } else if (header === 'joinurl' || header === 'url' || header === 'link') {
      headerMap['joinUrl'] = idx;
    } else if (header === 'chapter' || header === 'topic' || header === 'topics') {
      headerMap['chapter'] = idx;
    }
  });

  const parsedClasses: LiveClass[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (key: string): string => {
      const idx = headerMap[key];
      if (idx !== undefined && idx < row.length) {
        return row[idx].trim();
      }
      return '';
    };

    const courseId = getVal('courseId');
    const date = getVal('date');
    const startTime = getVal('startTime');
    const endTime = getVal('endTime');
    const joinUrl = getVal('joinUrl');
    const chapter = getVal('chapter');
    const explicitId = getVal('id');

    // Skip empty rows
    if (!courseId && !joinUrl && !chapter && !date) continue;

    const cleanCourseKey = (courseId || 'class').replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanTimeKey = (startTime || '').replace(/[^a-zA-Z0-9]/g, '');
    const generatedId = explicitId || `live-${cleanCourseKey}-${date || r}-${cleanTimeKey || r}`;

    parsedClasses.push({
      id: generatedId,
      courseId: courseId || '',
      liveBatcheId: courseId || '',
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '04:30 PM',
      endTime: endTime || '06:00 PM',
      joinUrl: joinUrl || '',
      chapter: chapter || '',
      topics: chapter ? [chapter] : [],
    });
  }

  return parsedClasses;
}

export const DEFAULT_GOOGLE_SHEET_LIVE_CLASSES_URL =
  'https://docs.google.com/spreadsheets/d/1IMLDtXqnuM1A35xpboR_IrcYh5563ZCy55dzl1vGW1A/edit?usp=sharing';

export async function fetchLiveClasses(): Promise<LiveClass[]> {
  let rawClasses: (LiveClass & { courseid?: string })[] = [];

  // 1. Fetch live classes directly from Google Sheet
  const sheetUrl =
    process.env.GOOGLE_SHEET_LIVE_CLASSES_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_LIVE_CLASSES_URL ||
    DEFAULT_GOOGLE_SHEET_LIVE_CLASSES_URL;

  if (sheetUrl) {
    try {
      const csvUrl = formatGoogleSheetCsvUrl(sheetUrl);
      const res = await fetch(csvUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const csvText = await res.text();
        const parsed = parseGoogleSheetCsv(csvText);
        if (parsed.length > 0) {
          rawClasses = parsed;
        }
      }
    } catch (sheetErr) {
      console.warn('API fetch live classes from Google Sheet failed:', sheetErr);
    }
  }

  // 2. Check external API if configured and sheet didn't return classes
  if (rawClasses.length === 0 && API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/live-classes/`);
      if (res.ok) {
        rawClasses = await res.json();
      }
    } catch (err) {
      console.warn('API fetch live classes failed:', err);
    }
  }

  // 3. Enrich with batch, course, instructor & calculated fields
  const [enrichedBatches, allCourses] = await Promise.all([
    fetchLiveBatches(),
    getLocalData<Course[]>('all-courses.json'),
  ]);

  return rawClasses.map((c, index) => {
    const lookupKey = (c.courseId || c.courseid || c.liveBatcheId || '').trim().toLowerCase();

    // Match batch by batch id or batch courseSlug
    const matchedBatch = enrichedBatches.find(
      (b) =>
        b.id.toLowerCase() === lookupKey ||
        b.courseSlug.toLowerCase() === lookupKey
    );

    // Match course by course id, course slug, or matched batch's courseSlug
    const matchedCourse = allCourses.find(
      (crs) =>
        crs.id.toLowerCase() === lookupKey ||
        crs.slug.toLowerCase() === lookupKey ||
        (matchedBatch && crs.slug.toLowerCase() === matchedBatch.courseSlug.toLowerCase())
    );

    // If batch was not matched directly, resolve batch by matched course's slug
    const resolvedBatch =
      matchedBatch ||
      (matchedCourse ? enrichedBatches.find((b) => b.courseSlug.toLowerCase() === matchedCourse.slug.toLowerCase()) : undefined);

    const detectedPlatform = deductPlatformFromUrl(c.joinUrl);
    const duration = calculateDurationMinutes(c.startTime, c.endTime);
    const chapterTopics = c.chapter ? [c.chapter] : (c.topics && c.topics.length > 0 ? c.topics : []);
    const courseTitle = matchedCourse?.title || resolvedBatch?.courseTitle || c.courseTitle || 'Live Computer Course';
    const courseSlug = matchedCourse?.slug || resolvedBatch?.courseSlug || c.courseSlug || '';
    const autoTitle = c.title || c.chapter || (chapterTopics.length > 0 ? chapterTopics.slice(0, 2).join(' & ') : resolvedBatch?.title || courseTitle || 'Live Interactive Class');
    const instructor = resolvedBatch?.instructor || c.instructor || 'Er. Sumit Kumar';
    const instructorPicture = resolvedBatch?.instructorPicture || c.instructorPicture || '';

    const cleanCourseKey = (courseSlug || lookupKey || 'class').replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanTimeKey = (c.startTime || '').replace(/[^a-zA-Z0-9]/g, '');
    const classId = c.id || `live-${cleanCourseKey}-${c.date}-${cleanTimeKey || index + 1}`;

    return {
      ...c,
      id: classId,
      courseId: c.courseId || c.courseid || lookupKey,
      liveBatcheId: resolvedBatch?.id || c.liveBatcheId || lookupKey,
      chapter: c.chapter || (chapterTopics.length > 0 ? chapterTopics[0] : ''),
      topics: chapterTopics,
      platform: c.platform || detectedPlatform,
      durationMinutes: c.durationMinutes || duration,
      title: autoTitle,
      description: c.description || resolvedBatch?.description || matchedCourse?.shortDescription || '',
      courseTitle,
      courseSlug,
      instructor,
      instructorPicture,
      instructorData: resolvedBatch?.instructorData,
      batchTitle: resolvedBatch?.title || '',
      batch: resolvedBatch,
    };
  });
}

export async function fetchLiveSchedule(): Promise<{ classes: LiveClass[]; batches: LiveBatch[] }> {
  const [enrichedClasses, enrichedBatches] = await Promise.all([
    fetchLiveClasses(),
    fetchLiveBatches(),
  ]);

  return {
    classes: enrichedClasses,
    batches: enrichedBatches,
  };
}

export async function fetchBranches(): Promise<Branch[]> {
  try {
    return await getLocalData<Branch[]>('branches.json');
  } catch (err) {
    console.warn('Could not load branches.json:', err);
    return [];
  }
}

export async function fetchSocialLinks(): Promise<SocialLinksRegistry> {
  try {
    return await getLocalData<SocialLinksRegistry>('social-links.json');
  } catch (err) {
    console.warn('Could not load social-links.json:', err);
    return {
      channels: [],
      googleReviews: {
        rating: '4.9',
        reviewCount: '128+',
        mapsUrl: 'https://maps.google.com/?q=MSK+Institute+Shikohabad',
        enabled: true,
      },
      whatsAppSupport: {
        phone: '+91 83930 42166',
        cleanNumber: '918393042166',
        defaultMessage: 'Hi MSK Institute, I want to inquire about courses and demo classes in Shikohabad.',
        counselorName: 'Er. Sumit Kumar',
        enabled: true,
      },
    };
  }
}
