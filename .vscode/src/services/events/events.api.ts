import { IEvent, IOrganizerEventsStats } from '@/interfaces';
import { axiosInstance as axios } from '@/lib/axiosClient';

export const fetchOrganizerEvents = async () => {
  try {
    const response = await axios.get<IEvent[]>('/events/me');
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchOrganizerEventsStats = async () => {
  try {
    const response = await axios.get<IOrganizerEventsStats>('/events/me/stats');
    return response.data;
  } catch (err) {
    console.error(err);
    return {
      eventsCount: 0,
      reviewsCount: 0,
      bookingsCount: 0,
      avgReviews: 0,
    } as IOrganizerEventsStats;
  }
};

export interface ICreateEvent {
  title: string;
  description: string;
  location: string;
  capacity: number;
  tags: string;
  endsAt: string;
  startsAt: string;
  categoryId: string;
}
export const createEvent = async (data: FormData) => {
  const response = await axios.post('/events', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const cancleEvent = async (eventId:string) => {
  const response = await axios.delete(`/events/${eventId}`);
  return response.data
};
