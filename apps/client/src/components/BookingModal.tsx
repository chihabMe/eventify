import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IEvent, IJsonResponse } from '@/interfaces';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosClient';
import { toast } from '@/hooks/use-toast';
import { queryClient } from '@/App';

interface BookingModalProps {
  isOpen: boolean;
  event: IEvent;
  onClose: () => void;
  onConfirm: (bookingId: string) => void;
}

const BookingModal = ({
  isOpen,
  event,
  onClose,
  onConfirm,
}: BookingModalProps) => {
  const { mutate: bookEvent, status } = useMutation({

    mutationFn: async () => {
      const response = await axiosInstance.post(`/bookings/${event.id}`);
      if (response.status !== 201) {
        throw new Error('Booking failed');
      }
      return response.data;
    },
    onSuccess: (data: { booking: { id: string } }) => {
      onConfirm(data.booking.id);
      queryClient.invalidateQueries({ queryKey: ['event', event.slug] });
    },
    onSettled: () => {
      onClose();
    },

    onError: (error) => {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking failed',
        description: error.message ?? 'Please try again later.',
        variant: 'destructive',
      });
    },
  });
  const isBooking = status == "pending"

  const handleConfirm = async () => {
    try {
      // Simulate API call
      bookEvent();
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Ticket</DialogTitle>
          <DialogDescription>
            Complete your booking for {event.title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isBooking}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isBooking}>
            {isBooking ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
