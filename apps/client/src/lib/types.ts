
export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'conference' | 'workshop' | 'concert' | 'festival' | 'sports' | 'networking' | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  images?: string[];
  price: number;
  category: EventCategory;
  tags: string[];
  organizerId: string;
  organizerName: string;
  status: EventStatus;
  capacity: number;
  bookedCount: number;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  eventId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  ticketCount: number;
  totalPrice: number;
}

export interface Statistics {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
}
