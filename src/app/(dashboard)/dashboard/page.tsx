import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardContent } from './dashboard-content';
import { DashboardSkeleton } from './dashboard-skeleton';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your M1NDMAP11 decision workspace overview.',
};

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
