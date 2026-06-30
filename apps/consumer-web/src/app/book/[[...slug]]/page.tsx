import { AppLayoutShell } from '@/components/AppLayoutShell'
import { Suspense } from 'react';
import BookDirectoryClient from './BookDirectoryClient';

interface BookPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <AppLayoutShell>
    <Suspense fallback={<div className="mx-auto px-6 py-8 max-w-[1400px] text-center text-gray-500">Loading directory...</div>}>
      <BookDirectoryClient slug={slug} />
    </Suspense>
  </AppLayoutShell>

}
