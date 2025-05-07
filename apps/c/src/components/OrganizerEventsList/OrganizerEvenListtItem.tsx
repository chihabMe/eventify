
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, FilePenLine, TrashIcon, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { eventsQueryKeys, useOrganizerCancelEventMutation } from '@/services/events/events.queries';
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { queryManager } from '@/services/query.manager';
import { IEvent } from '@/interfaces';
interface Props {
  event: IEvent
}
const OrganizerEventListItem: FC<Props> = ({ event }) => {
  const navigate = useNavigate();

  const handleCancelEvent = async (eventId: string) => {
    await cancelEvent(eventId, {
      onSuccess: () => {
        queryManager.invalidate(eventsQueryKeys.organizerEvents)
        toast({ title: "Event cancled" })
      }


    })
  }
  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleViewBookings = (eventId: string) => {
    // This would typically navigate to a bookings view filtered for this event
    navigate(`/bookings?eventId=${eventId}`);
  };

  const { mutateAsync: cancelEvent, isPending: isCanceling } = useOrganizerCancelEventMutation()
  return (
    < Card key={event.id} className="overflow-hidden" >
      <div className="md:flex">
        <div className="md:w-1/4 h-48 md:h-auto">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 md:w-3/4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full capitalize ${new Date(event.startsAt) > new Date() ? 'bg-blue-100 text-blue-800' :
              new Date(event.endsAt) > new Date() ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
              {
                new Date(event.startsAt) > new Date() ? 'upcoming' :
                  new Date(event.endsAt) > new Date() ? 'ongoing' :
                    'past'
              }
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <p>{formatDate(event.startsAt)}</p>
            <p>{event.location}</p>
          </div>

          <div className="mb-4 text-sm">
            <span className="font-medium">Capacity:</span> {event.capacity}
            <span className="mx-3">|</span>
            <span className="font-medium">Bookings:</span> {event._count?.bookings || 0} / {event.capacity}
            <span className="mx-3">|</span>
            <span className="font-medium">Category:</span> {event.category?.name || 'Uncategorized'}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to={`/events/${event.slug}`}>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleViewEvent(event.id)}
              >
                <Eye className="h-4 w-4" />
                View Event
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <FilePenLine className="h-4 w-4" />
              Edit Event
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => handleCancelEvent(event.id)}
            >
              <TrashIcon className="h-4 w-4" />
              {isCanceling ? "Canceling .... " : " Cancel Event"}
            </Button>
            <Button
              size="sm"
              onClick={() => handleViewBookings(event.id)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              View Bookings
            </Button>
          </div>
        </div>
      </div>
    </Card >
  )

}
export default OrganizerEventListItem;
