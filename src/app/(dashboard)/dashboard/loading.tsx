import { DashboardSkeleton } from './dashboard-skeleton';

export default function DashboardLoading() {
  return (
    <div className="p-4 lg:p-6">
      <DashboardSkeleton />
    </div>
  );
}
