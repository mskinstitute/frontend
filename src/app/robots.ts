import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/admin',
    '/api',
    '/dashboard',
    '/login',
    '/register',
    '/forgot-password',
    '/profile',
    '/r/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'Google-Extended',
          'Anthropic-AI',
          'PerplexityBot',
          'Bytespider',
          'Applebot-Extended',
          'cohere-ai',
          'Diffbot',
          'FacebookBot',
        ],
        allow: [
          '/',
          '/book-demo',
          '/courses/',
          '/tutorials',
          '/tutorials/',
          '/study-material/',
          '/blogs/',
          '/live',
          '/live-batches/',
          '/locations/',
          '/mock-test/',
          '/shortcuts/',
          '/learning-paths',
          '/playground',
          '/tools/',
          '/about',
          '/contact',
          '/llms.txt',
          '/llms-full.txt',
          '/feed.xml',
        ],
        disallow: ['/verify-certificate?id=*', ...privatePaths],
      },
    ],
    sitemap: 'https://www.mskinstitute.in/sitemap.xml',
  };
}
