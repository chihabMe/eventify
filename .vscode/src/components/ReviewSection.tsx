import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IEvent, IReview } from '@/interfaces';

interface ReviewSectionProps {
  event: IEvent;
  reviews: IReview[];
  userHasReviewed: boolean;
  onAddReview?: (rating: number, comment: string) => void;
}

const ReviewSection = ({
  event,
  reviews,
  userHasReviewed,
  onAddReview,
}: ReviewSectionProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      if (onAddReview) {
        await onAddReview(rating, comment);
      }
      // Reset form after submission
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : '0.0';

  // Check if the event has ended
  const eventHasEnded = new Date() > new Date(event.endsAt);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>

      <div className="flex items-center space-x-2 mb-6">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                parseFloat(averageRating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-medium text-lg">{averageRating}</span>
        <span className="text-gray-500">({reviews.length} reviews)</span>
      </div>

      {!eventHasEnded ? (
        <div className="mb-8 p-5 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Reviews will be open after the event ends.
          </h4>
          <p className="text-gray-500">
            You can share your thoughts and feedback once the event is
            completed.
          </p>
        </div>
      ) : !userHasReviewed && onAddReview ? (
        <div className="mb-8 p-5 border border-gray-200 rounded-lg">
          <h4 className="font-medium mb-3">Write a Review</h4>

          <div className="flex items-center mb-4">
            <span className="mr-2">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(star)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      hoveredRating >= star || rating >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Share your thoughts about this event..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3"
            rows={3}
          />

          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      ) : null}

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={review.user.imageUrl || 'https://i.pravatar.cc/150'}
                    alt={review.user.firstName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{review.user.firstName}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          review.rating >= star
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to leave a review!
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
