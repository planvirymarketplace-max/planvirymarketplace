export type CategoryLens =
  | 'services'
  | 'plan'
  | 'things-to-do'
  | 'food-drink'
  | 'live-shows'
  | 'travel'
  | 'party'
  | 'spaces'
  | 'vendors';

export interface CartItem {
  id: string;
  title: string;
  category: CategoryLens;
  price: number;
  date: string;
  time: string;
  location: string;
  image: string;
  rating?: number;
  reviews?: string;
  details?: string;
  tag?: string;
  badge?: string;
}

export interface ItineraryEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: string;
  location: string;
  status: 'Confirmed' | 'Pending';
  duration?: string;
  image?: string;
  hasConflict?: boolean;
  conflictMessage?: string;
}

export interface SearchParams {
  where: string;
  when: string;
  who: string;
}
