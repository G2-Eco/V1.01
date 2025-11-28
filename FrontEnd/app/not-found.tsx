'use client';
export const dynamic = 'force-dynamic'; // prevent prerender

import NotFoundContent from './NotFoundContent';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
