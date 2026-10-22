'use client';

import dynamic from 'next/dynamic';

const InstallAppModal = dynamic(() => import('@/components/InstallAppModal'), { ssr: false });
const PwaUpdateToast = dynamic(() => import('@/components/PwaUpdateToast'), { ssr: false });
const FloatingWhatsAppCTA = dynamic(() => import('@/components/FloatingWhatsAppCTA'), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <InstallAppModal />
      <PwaUpdateToast />
      <FloatingWhatsAppCTA />
    </>
  );
}
