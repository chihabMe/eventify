import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IEvent } from '@/interfaces';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axiosClient';
import { toast } from '@/hooks/use-toast';
import { queryClient } from '@/App';

interface CancelBookingModalProps {
  isOpen: boolean;
  event: IEvent;
  onClose: () => void;
  onCancel: (bookingId: string) => void;
}

const CancelBookingModal = ({
  isOpen,
  event,
  onClose,
  onCancel,
}: CancelBookingModalProps) => {
  const { mutate: cancelBooking, status } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/bookings/${event.id}`);
      if (response.status !== 200) {
        throw new Error('Cancellation failed');
      }
      return response.data;
    },
    onSuccess: (data: { bookingId: string }) => {
      onCancel(data.bookingId);
      queryClient.invalidateQueries({ queryKey: ['event', event.slug] });
    },
    onSettled: () => {
      onClose();
    },
    onError: (error) => {
      console.error('Cancellation failed:', error);
      toast({
        title: 'Cancellation failed',
        description: error.message ?? 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  const handleCancel = async () => {
    try {
      cancelBooking();
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };
  const isCancelling = status == "pending"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your booking for {event.title}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isCancelling}>
            No, Keep Booking
          </Button>
          <Button onClick={handleCancel} disabled={isCancelling}>
            {isCancelling ? 'Processing...' : 'Yes, Cancel Booking'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelBookingModal;
