import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from './events.api';

export const eventsQueryKeys = {
  organizerEvents: ['organizerEvents'] as const,
  organizerEventsStats: ['organizerEventsStats'] as const,
};

export const useOrganizerEventsQuery = () =>
  useQuery({
    queryKey: eventsQueryKeys.organizerEvents,
    queryFn: api.fetchOrganizerEvents,
  });

export const useOrganizerEventsStatsQuery = () =>
  useQuery({
    queryKey: eventsQueryKeys.organizerEventsStats,
    queryFn: api.fetchOrganizerEventsStats,
  });

export const useCreateEventMutation = () =>
  useMutation({
    mutationFn: (data: FormData) => api.createEvent(data),
  });

  export const useOrganizerCancelEventMutation = ()=> useMutation({
    mutationFn:(eventId:string) => api.cancleEvent(eventId)
  })
