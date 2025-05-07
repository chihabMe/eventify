"use client"

import { type FC, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganizerEventsQuery } from "@/services/events/events.queries"
import { formatDate } from "@/lib/utils"
import type { IBooking, IEvent } from "@/interfaces"
import { useEventBookingsQuery } from "@/services/booking/booking.queries"
import { CalendarIcon, ExternalLink, RefreshCcw, Ticket, User } from "lucide-react"

const OrganizerBookingsList: FC = () => {
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useOrganizerEventsQuery()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const {
    data: bookings,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useEventBookingsQuery(selectedEventId)

  const selectedEvent = events?.find((event) => event.id === selectedEventId) || null

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId || null)
  }

  const handleRefresh = () => {
    refetchEvents()
    if (selectedEventId) {
      refetchBookings()
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Event Bookings</CardTitle>
            <CardDescription className="mt-1">
              {selectedEvent ? `Showing bookings for ${selectedEvent.title}` : "Select an event to view its bookings"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="self-start sm:self-auto">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="max-w-md">
            {eventsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedEventId || ""}
                onValueChange={handleEventChange}
                disabled={eventsLoading || !events || events.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {!events || events.length === 0 ? (
                    <SelectItem value="no-events">No events available</SelectItem>
                  ) : (
                    events.map((event: IEvent) => (
                      <SelectItem key={event.id} value={event.id} className="hover:!text-white cursor-pointer">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {event.title} - {formatDate(event.startsAt)}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedEventId ? (
            bookingsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !bookings || bookings.data.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">No bookings found for this event</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Bookings will appear here once customers purchase tickets
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Booking ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booking Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.data.map((booking: IBooking & { user?: { firstName: string; lastName: string } }) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">
                              {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "Unknown User"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-primary" asChild>
                            <a href={booking.ticketUrl} target="_blank" rel="noopener noreferrer">
                              <Ticket className="h-3.5 w-3.5 mr-1" />
                              View Ticket
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                          >
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(booking.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <div className="text-center py-16 border rounded-lg bg-muted/10">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">Select an event to view bookings</p>
              <p className="text-sm text-muted-foreground mt-1">Choose an event from the dropdown above</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default OrganizerBookingsList
