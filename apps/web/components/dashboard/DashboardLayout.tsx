'use client';

import ActionPanel from '../actions/ActionPanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <ActionPanel />
          {children}
        </div>
      </div>
    </div>
  );
}