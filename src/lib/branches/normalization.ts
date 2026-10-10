/**
 * MSK Institute — Multi-Branch City Normalization Engine
 *
 * Normalizes city strings into a canonical, lowercase, punctuation-free format.
 * This guarantees reliable uniqueness constraints across user inputs, franchise
 * applications, URLs, and database records.
 *
 * Examples:
 * - "Agra" -> "agra"
 * - " AGRA " -> "agra"
 * - "Agra City" -> "agra"
 * - "Shikohabad " -> "shikohabad"
 * - "Jaipur Junction" -> "jaipur"
 */

export function normalizeCity(rawCity: string): string {
  if (!rawCity || typeof rawCity !== 'string') return '';

  let normalized = rawCity
    .trim()
    .toLowerCase()
    // Replace hyphens and underscores with spaces
    .replace(/[-_]+/g, ' ')
    // Remove all non-alphanumeric and non-space characters
    .replace(/[^a-z0-9\s]/g, '')
    // Collapse multiple consecutive spaces
    .replace(/\s+/g, ' ');

  // Strip common redundant administrative or transport suffixes
  const redundantSuffixes = [
    /\s+city$/i,
    /\s+town$/i,
    /\s+junction$/i,
    /\s+cantt$/i,
    /\s+cantonment$/i,
  ];

  for (const suffix of redundantSuffixes) {
    normalized = normalized.replace(suffix, '');
  }

  return normalized.trim();
}

/**
 * Creates a unique composite geographical key for branch exclusivity validation.
 * Rule: Only ONE active branch allowed per (city + state + country).
 */
export function createGeographicKey(city: string, state = 'Uttar Pradesh', country = 'India'): string {
  const normCity = normalizeCity(city);
  const normState = (state || 'Uttar Pradesh').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const normCountry = (country || 'India').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normCity}:${normState}:${normCountry}`;
}
