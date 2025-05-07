import { useQuery } from '@tanstack/react-query';
import * as api from './booking.api';

export const bookingQueryKeys = {
  organizerBookingKey: ['event', 'bookings'],
};

export const useEventBookingsQuery = (eventId:string) =>
  useQuery({
    queryKey: [...bookingQueryKeys.organizerBookingKey,eventId],
    queryFn: () => api.fetchAllOrganizerBookings(eventId),
  });
