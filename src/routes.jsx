import React from 'react';

const Home = React.lazy(() => import('./pages/Home.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const CourseListOffline = React.lazy(() => import('./pages/Course/CourseListOffline.jsx'));
const CourseDetailOffline = React.lazy(() => import('./pages/Course/CourseDetailOffline.jsx'));
const Notes = React.lazy(() => import('./pages/Notes.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));
const Terms = React.lazy(() => import('./pages/Terms.jsx'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy.jsx'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy.jsx'));

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/terms', element: <Terms /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/refund-policy', element: <RefundPolicy /> },
  { path: '/notes', element: <Notes /> },
  { path: '/courses', element: <CourseListOffline /> },
  { path: '/courses/:slug', element: <CourseDetailOffline /> },
  { path: '*', element: <NotFound /> },
];
