import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
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
          '/courses/',
          '/tutorials/',
          '/study-material/',
          '/blogs/',
          '/live-batches/',
          '/playground',
          '/tools/',
          '/about',
          '/contact',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: ['/verify-certificate?id=*', '/admin', '/api'], // Protect private certificate details and internal endpoints
      },
    ],
    sitemap: 'https://www.mskinstitute.in/sitemap.xml',
  };
}
