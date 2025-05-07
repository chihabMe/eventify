// EventDetailsSection.jsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReviewSection from '@/components/ReviewSection';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosClient';
import { IReview, IJsonResponse } from '@/interfaces';

const EventDetailsSection = ({ event }) => {
  // Fetch reviews only when reviews tab is selected
  const [activeTab, setActiveTab] = useState('details');

  const { data: reviewsData } = useQuery({
    queryKey: ['event-reviews', event.id],
    queryFn: () => axiosInstance.get<IJsonResponse<IReview[]>>(`/events/${event.id}/reviews`),
    // Only fetch when reviews tab is active
    enabled: activeTab === 'reviews',
  });

  const reviews = reviewsData?.data?.data || [];

  // Handle adding review
  const handleAddReview = async (rating, comment) => {
    console.log('reviewing');
    // Implement review submission logic
  };

  // Check if the user has already reviewed
  const userHasReviewed = false; // This should be determined based on user auth state

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({event._count.reviews})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">
              About This Event
            </h3>
            <p className="whitespace-pre-wrap">{event.description}</p>

            <h4 className="text-lg font-semibold mt-6 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewSection
            event={event}
            reviews={reviews}
            userHasReviewed={userHasReviewed}
            onAddReview={handleAddReview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetailsSection;
