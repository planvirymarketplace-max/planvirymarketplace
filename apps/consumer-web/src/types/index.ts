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
  date?: string;
  time?: string;
  location: string;
  image: string;
  badge?: string;
  rating?: number;
  description?: string;
  vendorName?: string;
  isTicketmaster?: boolean;
  quantity?: number;
  subcategory?: string;
}

export interface ItineraryEvent {
  id: string;
  title: string;
  category: CategoryLens;
  time: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  price: number;
  date: string; // 'Friday' | 'Saturday' | 'Sunday'
  description: string;
  image: string;
  ticketDetails?: string;
  commentsCount?: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Orchestrator' | 'Contributor' | 'Viewer';
  isViewing: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  time: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isSelf: boolean;
}

export interface VendorMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  sparkline: number[];
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientTier: string;
  clientAvatar: string;
  occasionName: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Declined';
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  category: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  description?: string;
}
