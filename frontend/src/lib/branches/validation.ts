/**
 * MSK Institute — Branch Validation & Exclusivity Enforcement
 *
 * Implements the core business rule:
 * "Only ONE active MSK Institute franchise/branch may exist in ONE city."
 */

import { Branch } from '@/types';
import { normalizeCity, createGeographicKey } from './normalization';

export class BranchExclusivityError extends Error {
  constructor(public city: string, public conflictingBranchIds: string[], message?: string) {
    super(
      message ||
        `Branch Exclusivity Violation: More than one active branch detected in city '${city}'. Conflicting branches: ${conflictingBranchIds.join(
          ', '
        )}`
    );
    this.name = 'BranchExclusivityError';
  }
}

/**
 * Validates that no two branches with status === 'OPEN' exist in the same normalized city.
 * Throws BranchExclusivityError if a collision is found.
 */
export function assertSingleActiveBranchPerCity(branches: Branch[]): void {
  const activeGeographicMap = new Map<string, Branch[]>();

  for (const branch of branches) {
    // Only 'OPEN' branches occupy exclusive operational territory
    if (branch.status === 'OPEN') {
      const geoKey = createGeographicKey(branch.city, branch.state, branch.country);
      const existing = activeGeographicMap.get(geoKey) || [];
      existing.push(branch);
      activeGeographicMap.set(geoKey, existing);
    }
  }

  for (const [geoKey, branchList] of activeGeographicMap.entries()) {
    if (branchList.length > 1) {
      const city = branchList[0].city;
      const ids = branchList.map((b) => b.id);
      throw new BranchExclusivityError(city, ids);
    }
  }
}

export interface CityAvailabilityResult {
  city: string;
  normalizedCity: string;
  status: 'AVAILABLE' | 'ALREADY_OCCUPIED' | 'COMING_SOON' | 'RESERVED';
  activeBranch?: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  message: string;
}

/**
 * Checks if a city is available for franchise expansion against an array of branches.
 */
export function validateCityAvailability(
  city: string,
  branches: Branch[],
  state = 'Uttar Pradesh',
  country = 'India'
): CityAvailabilityResult {
  const normCity = normalizeCity(city);
  const targetKey = createGeographicKey(normCity, state, country);

  for (const b of branches) {
    const branchKey = createGeographicKey(b.city, b.state, b.country);
    if (branchKey === targetKey) {
      if (b.status === 'OPEN') {
        return {
          city,
          normalizedCity: normCity,
          status: 'ALREADY_OCCUPIED',
          activeBranch: { id: b.id, name: b.name, slug: b.slug, status: b.status },
          message: `MSK Institute already has an active campus in ${b.city}.`,
        };
      }
      if (b.status === 'COMING_SOON') {
        return {
          city,
          normalizedCity: normCity,
          status: 'COMING_SOON',
          activeBranch: { id: b.id, name: b.name, slug: b.slug, status: b.status },
          message: `An MSK Institute center is currently in development for ${b.city}.`,
        };
      }
      if (b.status === 'PLANNED') {
        return {
          city,
          normalizedCity: normCity,
          status: 'RESERVED',
          activeBranch: { id: b.id, name: b.name, slug: b.slug, status: b.status },
          message: `Franchise territory in ${b.city} is under reserved planning.`,
        };
      }
    }
  }

  return {
    city,
    normalizedCity: normCity,
    status: 'AVAILABLE',
    message: `Territory in ${city} is currently available for an MSK Institute franchise!`,
  };
}

/**
 * Performs structural validation on a Branch record.
 * Returns a list of error strings (empty if valid).
 */
export function validateBranchRecord(
  branch: Branch,
  validCourseIds: Set<string> = new Set(),
  validBatchIds: Set<string> = new Set()
): string[] {
  const errors: string[] = [];

  if (!branch.id || !branch.id.trim()) errors.push('Missing branch ID');
  if (!branch.name || !branch.name.trim()) errors.push('Missing branch name');
  if (!branch.slug || !branch.slug.trim()) errors.push('Missing branch slug');
  if (!branch.city || !branch.city.trim()) errors.push('Missing city');
  if (!branch.state || !branch.state.trim()) errors.push('Missing state');
  if (!branch.country || !branch.country.trim()) errors.push('Missing country');

  if (branch.status === 'OPEN') {
    if (!branch.address || !branch.address.trim()) {
      errors.push(`OPEN branch '${branch.name}' must have a physical address`);
    }
    if (!branch.phone || !branch.phone.trim()) {
      errors.push(`OPEN branch '${branch.name}' must have a contact phone number`);
    }
    if (!branch.email || !branch.email.trim()) {
      errors.push(`OPEN branch '${branch.name}' must have an email address`);
    }
    if (typeof branch.latitude !== 'number' || typeof branch.longitude !== 'number') {
      errors.push(`OPEN branch '${branch.name}' must have valid numeric coordinates`);
    }
    if (!branch.openingHours || branch.openingHours.length === 0) {
      errors.push(`OPEN branch '${branch.name}' must specify opening hours`);
    }
  }

  // Cross-reference courses if provided
  if (validCourseIds.size > 0 && Array.isArray(branch.availableCourseIds)) {
    for (const cId of branch.availableCourseIds) {
      if (!validCourseIds.has(cId)) {
        errors.push(`Invalid course reference '${cId}' in branch '${branch.id}'`);
      }
    }
  }

  // Cross-reference batches if provided
  if (validBatchIds.size > 0 && Array.isArray(branch.activeBatchIds)) {
    for (const bId of branch.activeBatchIds) {
      if (!validBatchIds.has(bId)) {
        errors.push(`Invalid batch reference '${bId}' in branch '${branch.id}'`);
      }
    }
  }

  return errors;
}
