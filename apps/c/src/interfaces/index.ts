export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  role: IUserRole;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}
export interface IJsonResponse<T> {
  data: T;
}
// IBook interface for the Book model
export interface IBook {
  id: string;
  title: string;
  author: string;
  publishedAt: Date;
}

// IRefreshToken interface for the RefreshToken model
export interface IRefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

// IEmailVerificationToken interface for the EmailVerificationToken model
export interface IEmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}

// IEvent interface for the Event model
export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  capacity: number;
  startsAt: Date;
  endsAt: Date;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  organizerId: string;
  tags: string[];
  category: IEventCategory;
  organizer: {
    id: string;
    firstName: string;
    imageUr: string;
  };
  _count: {
    bookings: number; // Count of related bookings
    reviews: number; // Count of related reviews
  };
  booked: boolean; // Indicates if the user has booked this event
}

// IEventCategory interface for the EventCategory model
export interface IEventCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  events: IEvent[]; // Relation to Event
  _count: {
    events: number; // Count of related events
  };
}

// IBooking interface for the Booking model
export interface IBooking {
  id: string;
  userId: string;
  eventId: string;
  event:IEvent,
  user:IUser,
  ticketUrl: string;
  createdAt: Date;
}

// IReview interface for the Review model
export interface IReview {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    imageUrl: string;
  };
}
export interface IOrganizerEventsStats {
  eventsCount: number;
  reviewsCount: number;
  bookingsCount: number;
  avgReviews: number;
}

export type IUserRole = 'USER' | 'ORGANIZER' | 'ADMIN';
