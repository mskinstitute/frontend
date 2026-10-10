import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MSK Institute',
    short_name: 'MSK Institute',
    description: 'MSK Institute - Learn coding, web development, and digital tools with practical courses in HTML, CSS, JavaScript, Python, and Computer Courses in Shikohabad.',
    start_url: '/?source=pwa',
    id: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#0A2540',
    theme_color: '#0A2540',
    orientation: 'portrait-primary',
    display_override: ['standalone', 'minimal-ui'],
    prefer_related_applications: false,
    categories: ['education', 'technology', 'training', 'coding'],
    icons: [
      {
        src: '/brand/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/android-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/brand/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/brand/screenshot-mobile.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'MSK Institute Mobile App & Live Batches',
      },
      {
        src: '/brand/screenshot-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'MSK Institute Course Catalog & Study Material',
      },
    ],
    shortcuts: [
      {
        name: 'Courses',
        short_name: 'Courses',
        description: 'Browse our available courses',
        url: '/courses',
        icons: [{ src: '/brand/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Live Classes',
        short_name: 'Live',
        description: 'Check live class schedule',
        url: '/live',
        icons: [{ src: '/brand/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Study Material',
        short_name: 'Material',
        description: 'Tutorials, cheatsheets, and study materials',
        url: '/study-material',
        icons: [{ src: '/brand/favicon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Verify Certificate',
        short_name: 'Verify',
        description: 'Validate student certificates',
        url: '/verify-certificate',
        icons: [{ src: '/brand/favicon-96x96.png', sizes: '96x96' }],
      },
    ],
  };
}
