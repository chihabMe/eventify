// components/EventsList.tsx
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrganizerEventsQuery } from '@/services/events/events.queries';
import { IEvent } from '@/interfaces';
import { Calendar } from 'lucide-react';
import OrganizerEventListItem from './OrganizerEvenListtItem';

const OrganizerEventsList: FC = () => {
  const navigate = useNavigate();
  const { data: events, isLoading, isError } = useOrganizerEventsQuery();




  if (isLoading) {
    return <div className="flex justify-center items-center p-12">Loading events...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500">Failed to load events. Please try again later.</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Events Created</h3>
          <p className="text-muted-foreground mb-6">You haven't created any events yet.</p>
          <Button onClick={() => navigate('/events/create')}>Create Your First Event</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {events?.map((event: IEvent) => (
        <OrganizerEventListItem key={event.id} event={event} />
      ))}
    </div>
  );
};

export default OrganizerEventsList;
