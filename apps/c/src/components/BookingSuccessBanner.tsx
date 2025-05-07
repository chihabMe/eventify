// BookingSuccessBanner.jsx
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API } from '@/constants';

const BookingSuccessBanner = ({ bookingId }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-green-500 mr-3">
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span>
            Your booking has been confirmed! A confirmation email has been
            sent to your inbox.
          </span>
        </div>
        <div className="flex">
          <Link to={`${API}/bookings/${bookingId}/ticket`}>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download Ticket
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessBanner;
