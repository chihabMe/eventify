// EventDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosClient';
import { IJsonResponse, IEvent } from '@/interfaces';
import BookingModal from '@/components/BookingModal';
import CancelBookingModal from '@/components/CancelBookingModal';
import BookingSuccessBanner from '@/components/BookingSuccessBanner';
import EventHeader from '@/components/EventHeader';
import EventImageGallery from '@/components/EventImageGalary';
import EventDetailsSection from '@/components/EventDetailsSection';
import EventSidebar from '@/components/EventSidebar';
import { useAuth } from '@/hooks/useAuth';

const EventDetail = () => {
  const { slug } = useParams();
  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => axiosInstance.get<IJsonResponse<IEvent>>(`/events/${slug}`),
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);

  // Handle booking confirmation
  const handleBookingConfirm = (bookingId: string) => {
    setShowBookingModal(false);
    setBookingId(bookingId);
    setShowBookingSuccess(true);
  };

  const handleCancelBooking = () => {
    setShowCancelBookingModal(false);
    setBookingId('');
    setShowBookingSuccess(false);
  };

  if (isLoading || !eventData) {
    return <LoadingState />;
  }

  const event = eventData.data.data;

  if (!event) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {showBookingSuccess && <BookingSuccessBanner bookingId={bookingId} />}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>

          <EventHeader
            event={event}
            onBookNow={() => setShowBookingModal(true)}
            onCancelBooking={() => setShowCancelBookingModal(true)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EventImageGallery images={[event.imageUrl]} />
            <EventDetailsSection event={event} />
          </div>

          <div className="lg:col-span-1">
            <EventSidebar
              event={event}
              onBookNow={() => setShowBookingModal(true)}
              onCancelBooking={() => setShowCancelBookingModal(true)}
            />
          </div>
        </div>
      </div>

      {event && (
        <BookingModal
          isOpen={showBookingModal}
          event={event}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
        />
      )}

      {event && (
        <CancelBookingModal
          isOpen={showCancelBookingModal}
          event={event}
          onClose={() => setShowCancelBookingModal(false)}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
};

// Loading and NotFound component states

const NotFoundState = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
      <p className="mb-6">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link to="/">Browse Events</Link>
      </Button>
    </div>
  </div>
);

export default EventDetail;

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="inline-flex items-center text-gray-300 mb-4">
          <div className="h-4 w-4 mr-1 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Event header skeleton */}
        <div className="mb-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="flex items-center mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded mr-4"></div>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Image gallery skeleton */}
          <div className="bg-gray-200 rounded-lg h-96 mb-6 animate-pulse"></div>

          {/* Event details section skeleton */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>

            <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-6 w-6 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-7 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <div className="h-5 w-28 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-px w-full bg-gray-200"></div>
              <div className="flex justify-between font-bold">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
