'use client';

const OFFLINE_LESSONS_CACHE = 'msk-offline-lessons';
const SAVED_TOPICS_STORAGE_KEY = 'msk_offline_saved_topics';

export interface SavedTopicMeta {
  slug: string;
  topicSlug: string;
  title?: string;
  url: string;
  savedAt: string;
}

export async function isTutorialSavedOffline(slug: string, topicSlug: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const list = getSavedTutorialsList();
    const isRecorded = list.some((item) => item.slug === slug && item.topicSlug === topicSlug);
    if (!isRecorded) return false;

    const cache = await caches.open(OFFLINE_LESSONS_CACHE);
    const url = `/tutorials/${slug}/${topicSlug}`;
    const match = await cache.match(url);
    return Boolean(match);
  } catch {
    return false;
  }
}

export function getSavedTutorialsList(): SavedTopicMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_TOPICS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveTutorialOffline(
  slug: string,
  topicSlug: string,
  title?: string
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    throw new Error('Offline caching is not supported on this browser.');
  }

  const currentUrl = `/tutorials/${slug}/${topicSlug}`;
  const cache = await caches.open(OFFLINE_LESSONS_CACHE);

  try {
    // 1. Fetch and store the HTML content of the lesson
    const response = await fetch(currentUrl, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson HTML (${response.status})`);
    }
    await cache.put(currentUrl, response);

    // 2. Also cache critical static assets needed to view the lesson
    const staticAssets = [
      '/manifest.webmanifest',
      '/logo.jpg',
      '/brand/icon-192x192.png',
      '/brand/favicon-32x32.png',
    ];
    await Promise.allSettled(
      staticAssets.map((asset) =>
        fetch(asset).then((res) => (res.ok ? cache.put(asset, res) : null))
      )
    );

    // 3. Persist record in localStorage list
    const list = getSavedTutorialsList().filter(
      (item) => !(item.slug === slug && item.topicSlug === topicSlug)
    );
    list.push({
      slug,
      topicSlug,
      title,
      url: currentUrl,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(SAVED_TOPICS_STORAGE_KEY, JSON.stringify(list));

    return true;
  } catch (err) {
    console.error('Error saving tutorial for offline reading:', err);
    throw err;
  }
}

export async function removeTutorialOffline(slug: string, topicSlug: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;

  const currentUrl = `/tutorials/${slug}/${topicSlug}`;
  try {
    const cache = await caches.open(OFFLINE_LESSONS_CACHE);
    await cache.delete(currentUrl);

    const list = getSavedTutorialsList().filter(
      (item) => !(item.slug === slug && item.topicSlug === topicSlug)
    );
    localStorage.setItem(SAVED_TOPICS_STORAGE_KEY, JSON.stringify(list));

    return true;
  } catch (err) {
    console.warn('Error removing tutorial from offline cache:', err);
    return false;
  }
}
