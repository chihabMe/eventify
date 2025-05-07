
import { Event, Review, User, Booking, Statistics } from '../lib/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john',
    role: 'user',
    isActive: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    role: 'organizer',
    isActive: true
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    role: 'admin',
    isActive: true
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'A three-day conference for developers, designers, and product managers. Learn about the latest technologies and best practices in the industry. Network with professionals and find new opportunities.',
    shortDescription: 'The biggest tech event of the year with top industry speakers.',
    date: '2025-06-15',
    time: '09:00 AM',
    location: 'Tech Center, San Francisco',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
    images: [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=400'
    ],
    price: 299.99,
    category: 'conference',
    tags: ['tech', 'programming', 'design', 'networking'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 500,
    bookedCount: 320,
    rating: 4.8,
    reviewCount: 45,
    isApproved: true
  },
  {
    id: '2',
    title: 'Summer Music Festival',
    description: 'A weekend of music, food, and fun. Featuring top artists from around the world. Enjoy performances across multiple stages and genres.',
    shortDescription: 'Annual music festival featuring top artists and bands.',
    date: '2025-07-22',
    time: '4:00 PM',
    location: 'City Park, Los Angeles',
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&h=400',
    price: 149.99,
    category: 'festival',
    tags: ['music', 'summer', 'food', 'outdoor'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 2000,
    bookedCount: 1200,
    rating: 4.5,
    reviewCount: 120,
    isApproved: true
  },
  {
    id: '3',
    title: 'Business Networking Brunch',
    description: 'Connect with local entrepreneurs and business professionals. Build valuable relationships while enjoying a delicious brunch.',
    shortDescription: 'Build your professional network over a delicious brunch.',
    date: '2025-05-18',
    time: '10:00 AM',
    location: 'Grand Hotel, New York',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400',
    price: 49.99,
    category: 'networking',
    tags: ['business', 'networking', 'brunch', 'professional'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 100,
    bookedCount: 65,
    rating: 4.2,
    reviewCount: 28,
    isApproved: true
  },
  {
    id: '4',
    title: 'Web Development Workshop',
    description: 'Learn modern web development techniques and frameworks. Hands-on exercises and projects to build your portfolio.',
    shortDescription: 'Intensive hands-on workshop for aspiring web developers.',
    date: '2025-06-05',
    time: '9:00 AM',
    location: 'Online Event',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600&h=400',
    price: 79.99,
    category: 'workshop',
    tags: ['webdev', 'programming', 'learning', 'online'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 50,
    bookedCount: 32,
    rating: 4.9,
    reviewCount: 18,
    isApproved: true
  },
  {
    id: '5',
    title: 'Championship Basketball Game',
    description: 'Watch the championship basketball game live! Food and drinks available at the venue.',
    shortDescription: 'Season finale championship basketball game.',
    date: '2025-04-30',
    time: '7:00 PM',
    location: 'Sports Arena, Chicago',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400',
    price: 89.99,
    category: 'sports',
    tags: ['basketball', 'sports', 'championship'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 1500,
    bookedCount: 1100,
    rating: 4.6,
    reviewCount: 65,
    isApproved: true
  },
  {
    id: '6',
    title: 'Photography Master Class',
    description: 'Learn advanced photography techniques from industry professionals. Bring your own camera for hands-on exercises.',
    shortDescription: 'Master the art of professional photography.',
    date: '2025-07-12',
    time: '10:00 AM',
    location: 'Art Center, Seattle',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400',
    price: 129.99,
    category: 'workshop',
    tags: ['photography', 'art', 'creative'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'upcoming',
    capacity: 30,
    bookedCount: 22,
    rating: 4.7,
    reviewCount: 14,
    isApproved: true
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?u=john',
    eventId: '1',
    rating: 5,
    comment: 'Great event with amazing speakers. Learned a lot and made good connections. Will definitely attend again next year.',
    date: '2024-04-20'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?u=john',
    eventId: '2',
    rating: 4,
    comment: 'Awesome lineup of artists. Food was a bit expensive but overall a great experience.',
    date: '2024-04-18'
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://i.pravatar.cc/150?u=john',
    eventId: '3',
    rating: 4,
    comment: 'Made some great connections. Would have liked a bit more structured networking.',
    date: '2024-04-15'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    eventId: '1',
    bookingDate: '2024-04-15',
    status: 'confirmed',
    ticketCount: 2,
    totalPrice: 599.98
  },
  {
    id: '2',
    userId: '1',
    eventId: '2',
    bookingDate: '2024-04-10',
    status: 'confirmed',
    ticketCount: 3,
    totalPrice: 449.97
  },
  {
    id: '3',
    userId: '1',
    eventId: '3',
    bookingDate: '2024-04-05',
    status: 'cancelled',
    ticketCount: 1,
    totalPrice: 49.99
  }
];

export const mockStatistics: Statistics = {
  totalUsers: 1254,
  totalEvents: 87,
  totalBookings: 3421,
  totalRevenue: 245678.50
};

// Get a mock user by role - returns first user with that role
export const getUserByRole = (role: 'user' | 'organizer' | 'admin'): User => {
  return mockUsers.find(user => user.role === role) || mockUsers[0];
};
