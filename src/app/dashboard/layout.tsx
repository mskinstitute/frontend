import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | MSK Institute',
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

