// EventSidebar.jsx
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const EventSidebar = ({ event, onBookNow, onCancelBooking }) => {
  // Calculate if event is sold out or has low availability
  const spotsLeft = Math.max(0, event.capacity - event._count.bookings);
  const isSoldOut = spotsLeft === 0;

  // Format date
  const eventDate = new Date(event.startsAt);
  const eventEndDate = new Date(event.endsAt);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6 sticky top-6">
      <div className="space-y-4 mb-6">
        <SidebarItem
          icon={<Calendar className="h-5 w-5 mr-3 text-gray-500" />}
          label="Date"
          value={formattedDate}
        />

        <SidebarItem
          icon={<Clock className="h-5 w-5 mr-3 text-gray-500" />}
          label="Time"
          value={new Date(event.startsAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        />

        <SidebarItem
          icon={<MapPin className="h-5 w-5 mr-3 text-gray-500" />}
          label="Location"
          value={event.location}
        />

        <SidebarItem
          icon={<Users className="h-5 w-5 mr-3 text-gray-500" />}
          label="Capacity"
          value={isSoldOut
            ? 'Sold Out'
            : `${spotsLeft} spots left out of ${event.capacity}`}
        />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-medium mb-2">Organizer</h3>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
            <img
              src={event.organizer.imageUr}
              alt={event.organizer.firstName}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
          </div>
          <div>
            <div className="font-medium">
              {event.organizer.firstName}
            </div>
            <div className="text-sm text-gray-500">Event Organizer</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <EventSidebarAction
          event={event}
          onBookNow={onBookNow}
          onCancelBooking={onCancelBooking}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon}
    <div>
      <div className="font-medium">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

const EventSidebarAction = ({ event, onBookNow, onCancelBooking }) => {

  const { isUser } = useAuth()
  const now = new Date();
  const eventDate = new Date(event.startsAt);
  const eventEndDate = new Date(event.endsAt);

  const spotsLeft = Math.max(0, event.capacity - event._count.bookings);
  const isSoldOut = spotsLeft === 0;

  if (now < eventDate && !isSoldOut) {
    if (event.booked) {
      return (
        <Button
          variant="destructive"
          onClick={onCancelBooking}
          className="w-full"
        >
          Cancel Booking
        </Button>
      );
    } else {
      return (
        <Button
          onClick={onBookNow}
          disabled={!isUser()}
          className={`w-full ${!isUser() && "disabled curosr-none opacity-50 "}`}
        >
          {isUser() ? "Book Tickets" : "You can't book this event"}
        </Button>
      );
    }
  } else if (isSoldOut) {
    return (
      <Button disabled className="w-full">
        Sold Out
      </Button>
    );
  } else if (now > eventEndDate) {
    return (
      <Button disabled className="w-full">
        Event Completed
      </Button>
    );
  } else {
    return (
      <Button variant="secondary" className="w-full">
        Happening Now
      </Button>
    );
  }
};

export default EventSidebar;
