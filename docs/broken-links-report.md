# MSK Institute Website — Broken Links Audit Report

**Date:** September 2026  
**Auditor:** Automated Repository Link & Route Verifier  
**Total Broken References Found:** 2  

## Executive Summary
This report identifies every broken internal course URL, stale reference in blogs, certificates, catalog comparison tables, and components. Every identified broken URL is mapped to its canonical destination and permanent 301 redirect.

| # | Source Page / File | Broken URL | Status | Intended Canonical Destination | Recommended Fix |
|---|---|---|---|---|---|
| 1 | `public/data/certificates.json [item 1: MSK-2026-0002]` | `/courses/full-stack-web-dev-bootcamp` | 404 Not Found | `/courses/full-stack-web-dev-bootcamp` | Update certificate courseSlug to 'full-stack-web-dev-bootcamp' |
| 2 | `src\components\CourseCatalogClient.tsx` | `/courses/full-stack-web-dev-bootcamp` | 404 Not Found | `/courses/full-stack-web-dev-bootcamp` | Update object slug to 'full-stack-web-dev-bootcamp' |

## Redirect Map Required for next.config.ts
```ts
const courseRedirects = [
  { source: '/courses/html5-complete-masterclass', destination: '/courses/html5-complete-course', permanent: true },
  { source: '/courses/html-complete-course', destination: '/courses/html5-complete-course', permanent: true },
  { source: '/courses/javascript-react-frontend-engineering', destination: '/courses/frontend-development--8-months', permanent: true },
  { source: '/courses/ccc-computer-concepts', destination: '/courses/ccc', permanent: true },
  { source: '/courses/ccc-course-on-computer-concepts', destination: '/courses/ccc', permanent: true },
  { source: '/courses/master-computer-coding-diploma', destination: '/courses/full-stack-development', permanent: true },
  { source: '/courses/python-programming-masterclass', destination: '/courses/python-mastery-beginner-to-advanced--3-months', permanent: true },
  { source: '/courses/full-stack-web-development-bootcamp', destination: '/courses/full-stack-web-dev-bootcamp', permanent: true },
  { source: '/courses/full-stack-web-development', destination: '/courses/full-stack-development', permanent: true },
  { source: '/courses/html5-css3-modern-ui-design', destination: '/courses/web-designing-complete-pathway--4-months', permanent: true },
  { source: '/courses/adca-advanced-diploma-computer-applications', destination: '/courses/adca', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },
  { source: '/career', destination: '/careers', permanent: true },
  { source: '/notes', destination: '/study-material', permanent: true },
];
```
