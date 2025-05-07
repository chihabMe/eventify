// EventHeader.jsx
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const EventHeader = ({ event, onBookNow, onCancelBooking }) => {
  // Calculate if event is sold out or has low availability
  const spotsLeft = Math.max(0, event.capacity - event._count.bookings);
  const isSoldOut = spotsLeft === 0;
  const isLowAvailability = spotsLeft <= event.capacity * 0.1;

  // Event dates
  const eventDate = new Date(event.startsAt);
  const eventEndDate = new Date(event.endsAt);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center text-amber-500">
            {new Date() > eventEndDate ? (
              <>
                <Star className="fill-current h-5 w-5" />
                <span className="text-gray-500 ml-1">
                  ({event._count.reviews} reviews)
                </span>
              </>
            ) : (
              <span className="text-gray-500">Not rated yet</span>
            )}
          </div>

          <Badge variant="outline" className="capitalize">
            {event.category.name}
          </Badge>

          <EventStatusBadge
            eventDate={eventDate}
            eventEndDate={eventEndDate}
            isSoldOut={isSoldOut}
            isLowAvailability={isLowAvailability}
            spotsLeft={spotsLeft}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="flex items-center">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>

        <EventActionButton
          eventDate={eventDate}
          eventEndDate={eventEndDate}
          isSoldOut={isSoldOut}
          isBooked={event.booked}
          onBookNow={onBookNow}
          onCancelBooking={onCancelBooking}
        />
      </div>
    </div>
  );
};

// Separated into smaller components for clarity
const EventStatusBadge = ({ eventDate, eventEndDate, isSoldOut, isLowAvailability, spotsLeft }) => {
  const now = new Date();

  if (now < eventDate) {
    if (isSoldOut) {
      return <Badge variant="destructive">Sold Out</Badge>;
    } else if (isLowAvailability) {
      return (
        <Badge variant="default" className="bg-amber-500">
          Few Spots Left
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-green-500 text-green-700">
          {spotsLeft} Spots Left
        </Badge>
      );
    }
  } else if (now >= eventDate && now <= eventEndDate) {
    return (
      <Badge variant="default" className="bg-green-500">
        Happening Now
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="text-gray-500">
        Completed
      </Badge>
    );
  }
};

const EventActionButton = ({ eventDate, eventEndDate, isSoldOut, isBooked, onBookNow, onCancelBooking }) => {
  const now = new Date();
  const { isUser } = useAuth()

  if (now < eventDate && !isSoldOut) {
    if (isBooked) {
      return (
        <Button variant="destructive" onClick={onCancelBooking} size="lg">
          Cancel Booking
        </Button>
      );
    } else {
      return (

        <Button disabled={!isUser()} onClick={onBookNow} size="lg" className={`w-full ${!isUser() && "disabled curosr-none opacity-50 "}`}>
          {isUser() ? "Book Now" : "Can't book"}
        </Button>
      );
    }
  } else if (now >= eventDate && now <= eventEndDate) {
    return (
      <Button variant="secondary" size="lg">
        Happening Now
      </Button>
    );
  } else {
    return (
      <Button disabled size="lg">
        Event Ended
      </Button>
    );
  }
};

export default EventHeader;
