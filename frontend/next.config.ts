import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/**': ['./public/**/*', './content/**/*'],
  },
  async redirects() {
    return [
      {
        source: '/campuses',
        destination: '/locations',
        permanent: true,
      },
      {
        source: '/branches',
        destination: '/locations',
        permanent: true,
      },
      {
        source: '/shikohabad',
        destination: '/locations/shikohabad',
        permanent: true,
      },
      {
        source: '/agra',
        destination: '/locations/agra',
        permanent: true,
      },
      {
        source: '/notes',
        destination: '/study-material',
        permanent: true,
      },
      {
        source: '/tools/playground',
        destination: '/playground',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/career',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/course',
        destination: '/courses',
        permanent: true,
      },
      {
        source: '/courses/html5-complete-masterclass',
        destination: '/courses/html5-complete-course',
        permanent: true,
      },
      {
        source: '/courses/html-complete-course',
        destination: '/courses/html5-complete-course',
        permanent: true,
      },
      {
        source: '/courses/javascript-react-frontend-engineering',
        destination: '/courses/frontend-development--8-months',
        permanent: true,
      },
      {
        source: '/courses/ccc-computer-concepts',
        destination: '/courses/ccc',
        permanent: true,
      },
      {
        source: '/courses/ccc-course-on-computer-concepts',
        destination: '/courses/ccc',
        permanent: true,
      },
      {
        source: '/courses/master-computer-coding-diploma',
        destination: '/courses/full-stack-development',
        permanent: true,
      },
      {
        source: '/courses/python-programming-masterclass',
        destination: '/courses/python-mastery-beginner-to-advanced--3-months',
        permanent: true,
      },
      {
        source: '/courses/full-stack-web-development-bootcamp',
        destination: '/courses/full-stack-web-dev-bootcamp',
        permanent: true,
      },
      {
        source: '/courses/full-stack-web-development',
        destination: '/courses/full-stack-development',
        permanent: true,
      },
      {
        source: '/courses/html5-css3-modern-ui-design',
        destination: '/courses/web-designing-complete-pathway--4-months',
        permanent: true,
      },
      {
        source: '/courses/adca-advanced-diploma-computer-applications',
        destination: '/courses/adca',
        permanent: true,
      },
      {
        source: '/tutorials/css',
        destination: '/tutorials/css-for-beginners',
        permanent: true,
      },
      {
        source: '/tutorials/css-mastery/:topicSlug*',
        destination: '/tutorials/css-for-intermediate/:topicSlug*',
        permanent: true,
      },
      {
        source: '/tutorials/css-mastery',
        destination: '/tutorials/css-for-intermediate',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-masterclass/:topicSlug*',
        destination: '/tutorials/html5-complete-course/:topicSlug*',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-masterclass',
        destination: '/tutorials/html5-complete-course',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/colors',
        destination: '/tutorials/html5-complete-course/html-colors-rgb',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/html-colors-color-codes',
        destination: '/tutorials/html5-complete-course/html-colors-rgb',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/links-navigation-lists',
        destination: '/tutorials/html5-complete-course/links-hyperlinks',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/lists',
        destination: '/tutorials/html5-complete-course/unordered-ordered-lists',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/tables-structured-data',
        destination: '/tutorials/html5-complete-course/html-tables',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/tables',
        destination: '/tutorials/html5-complete-course/html-tables',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/block-and-inline',
        destination: '/tutorials/html5-complete-course/block-vs-inline-elements',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/images-multimedia-embeds',
        destination: '/tutorials/html5-complete-course/images-responsive-art',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/forms-inputs-validations',
        destination: '/tutorials/html5-complete-course/forms-input-types',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/html5-semantic-architecture',
        destination: '/tutorials/html5-complete-course/semantic-layout-elements',
        permanent: true,
      },
      {
        source: '/tutorials/html5-complete-course/accessibility-aria-seo',
        destination: '/tutorials/html5-complete-course/accessibility-aria',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        source: '/(brand|icons|images|content|assets)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
