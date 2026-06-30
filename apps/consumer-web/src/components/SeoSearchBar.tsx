'use client';

import { LocationSearchBar } from '@/components/location-search-bar';
import { useRouter } from 'next/navigation';

interface SeoSearchBarProps {
  initialService?: string;
  initialLocation?: string;
}

export default function SeoSearchBar({ initialService = '', initialLocation = '' }: SeoSearchBarProps) {
  const router = useRouter();

  const handleSearch = (serviceSlug: string, locationSlug: string | null) => {
    if (locationSlug) {
      router.push(`/seo/${serviceSlug}/${locationSlug}`);
    } else {
      router.push(`/seo/${serviceSlug}`);
    }
  };

  return (
    <div className="mb-8">
      <LocationSearchBar
        variant="compact"
        initialService={initialService}
        initialLocation={initialLocation}
        onSearch={handleSearch}
      />
    </div>
  );
}
