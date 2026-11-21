/**
 * MSK Institute — Canonical Business & Local SEO Configuration
 *
 * Single Source of Truth for all NAP (Name, Address, Phone),
 * GeoCoordinates, Operating Hours, Synced GBP Pricing, and Schema.org metadata.
 *
 * Re-exports everything from @/config/institute for backwards-compatible imports.
 */

export * from './institute';
export { INSTITUTE_CONFIG as BUSINESS_CONFIG, INSTITUTE_CONFIG as BUSINESS_INFO } from './institute';
