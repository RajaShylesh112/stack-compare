'use client';

import TerminalLoader from '@/components/terminal-loader';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <TerminalLoader />
    </div>
  );
}
