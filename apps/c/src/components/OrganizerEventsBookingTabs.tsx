// components/EventsBookingsTabs.tsx
import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrganizerBookingsList from './OrganizerBookingList';
import OrganizerEventsList from './OrganizerEventsList/OrganizerEventsList';

interface EventsBookingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const OrganizerEventsBookingsTabs: FC<EventsBookingsTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
      </TabsList>

      <TabsContent value="events" className="space-y-4">
        <OrganizerEventsList />
      </TabsContent>

      <TabsContent value="bookings" className="space-y-4">
        <OrganizerBookingsList />
      </TabsContent>
    </Tabs>
  );
};

export default OrganizerEventsBookingsTabs;
