/**
 * MSK Institute — Multi-Branch Repository & Data Access Layer
 *
 * Provides a database-agnostic repository abstraction for branch entities.
 * Components, pages, and API handlers consume these methods without direct
 * JSON coupling, paving the way for future PostgreSQL / Supabase migration.
 */

import { Branch, BranchSummary, Course, LiveBatch } from '@/types';
import { fetchBranches, fetchCourses, fetchLiveBatches } from '@/services/api';
import { normalizeCity } from './normalization';
import { assertSingleActiveBranchPerCity, validateCityAvailability, CityAvailabilityResult } from './validation';

/**
 * Returns all branches in the registry.
 * Automatically asserts the One-City-One-Active-Branch business rule.
 */
export async function getAllBranches(): Promise<Branch[]> {
  const branches = await fetchBranches();
  // Enforce single active branch invariant
  assertSingleActiveBranchPerCity(branches);
  return branches;
}

/**
 * Returns branches that are publicly visible (OPEN or COMING_SOON).
 */
export async function getPublishedBranches(): Promise<Branch[]> {
  const branches = await getAllBranches();
  return branches.filter(
    (b) => b.status === 'OPEN' || b.status === 'COMING_SOON'
  );
}

/**
 * Returns operational branches (status === 'OPEN').
 */
export async function getOpenBranches(): Promise<Branch[]> {
  const branches = await getAllBranches();
  return branches.filter((b) => b.status === 'OPEN');
}

/**
 * Finds a branch by its unique public URL slug (e.g. 'shikohabad', 'agra').
 */
export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();
  const branches = await getAllBranches();
  return branches.find((b) => b.slug.toLowerCase() === cleanSlug) || null;
}

/**
 * Finds a branch by its internal ID (e.g. 'branch-shikohabad-001').
 */
export async function getBranchById(id: string): Promise<Branch | null> {
  if (!id) return null;
  const cleanId = id.trim();
  const branches = await getAllBranches();
  return branches.find((b) => b.id === cleanId) || null;
}

/**
 * Finds branches by city name (using normalized comparison).
 */
export async function getBranchesByCity(city: string): Promise<Branch[]> {
  if (!city) return [];
  const targetNorm = normalizeCity(city);
  const branches = await getAllBranches();
  return branches.filter((b) => normalizeCity(b.city) === targetNorm);
}

/**
 * Returns the primary corporate headquarters branch (Shikohabad).
 */
export async function getHeadquartersBranch(): Promise<Branch> {
  const branches = await getAllBranches();
  const hq = branches.find((b) => b.isHeadquarters && b.status === 'OPEN');
  if (hq) return hq;
  // Fallback to first open branch or first branch
  const firstOpen = branches.find((b) => b.status === 'OPEN');
  if (firstOpen) return firstOpen;
  return branches[0];
}

/**
 * Returns lightweight summaries for all published branches.
 * Used for fast rendering of location directories, dropdowns, and card grids.
 */
export async function getBranchSummaries(): Promise<BranchSummary[]> {
  const branches = await getPublishedBranches();
  return branches.map((b) => ({
    id: b.id,
    name: b.name,
    displayName: b.displayName,
    slug: b.slug,
    city: b.city,
    state: b.state,
    postalCode: b.postalCode,
    status: b.status,
    branchType: b.branchType,
    phone: b.phone,
    formattedPhone: b.formattedPhone,
    address: b.address,
    coursesCount: b.availableCourseIds?.length || 0,
    batchesCount: b.activeBatchIds?.length || 0,
    isHeadquarters: b.isHeadquarters,
  }));
}

/**
 * Resolves full Course objects available at a specified branch.
 * Relational join between Branch.availableCourseIds and CourseRepository.
 */
export async function getCoursesForBranch(branchIdOrSlug: string): Promise<Course[]> {
  const branch =
    (await getBranchBySlug(branchIdOrSlug)) || (await getBranchById(branchIdOrSlug));
  if (!branch || !branch.availableCourseIds || branch.availableCourseIds.length === 0) {
    return [];
  }

  const allCourses = await fetchCourses();
  const courseIdSet = new Set(branch.availableCourseIds);

  return allCourses.filter(
    (c) => c.status === 'PUBLISH' && (courseIdSet.has(c.id) || courseIdSet.has(c.slug))
  );
}

/**
 * Resolves active LiveBatch objects scheduled at a specified branch.
 */
export async function getBatchesForBranch(branchIdOrSlug: string): Promise<LiveBatch[]> {
  const branch =
    (await getBranchBySlug(branchIdOrSlug)) || (await getBranchById(branchIdOrSlug));
  if (!branch) return [];

  const allBatches = await fetchLiveBatches();
  const batchIdSet = new Set(branch.activeBatchIds || []);

  return allBatches.filter(
    (batch) =>
      batch.branchId === branch.id ||
      batch.branchSlug === branch.slug ||
      batchIdSet.has(batch.id)
  );
}

/**
 * Resolves which physical branches offer a given course.
 */
export async function getBranchesForCourse(courseIdOrSlug: string): Promise<Branch[]> {
  if (!courseIdOrSlug) return [];
  const publishedBranches = await getPublishedBranches();

  return publishedBranches.filter((b) => {
    if (!b.availableCourseIds) return false;
    return b.availableCourseIds.includes(courseIdOrSlug);
  });
}

/**
 * Checks city availability for franchise applications or expansion.
 */
export async function checkCityAvailability(
  city: string,
  state = 'Uttar Pradesh',
  country = 'India'
): Promise<CityAvailabilityResult> {
  const branches = await getAllBranches();
  return validateCityAvailability(city, branches, state, country);
}
