import { Link } from "react-router-dom"
import { Calendar, MapPin, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { IEvent } from "@/interfaces"

interface EventCardProps {
  event: IEvent
  className?: string
  featured?: boolean
}

const EventCard = ({ event, className, featured = false }: EventCardProps) => {
  // Calculate spots left
  const spotsLeft = Math.max(0, event.capacity - event._count.bookings)
  const isSoldOut = spotsLeft === 0
  const isLowAvailability = spotsLeft <= event.capacity * 0.1
  const isUpcoming = new Date(event.startsAt) > new Date() && new Date(event.endsAt) > new Date()
  const isOngoing = new Date(event.startsAt) <= new Date() && new Date(event.endsAt) >= new Date()
  const isCompleted = new Date(event.endsAt) < new Date()

  // Format dates in a more readable way
  const formatEventDate = (date: string) => {
    const eventDate = new Date(date)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(eventDate)
  }

  // Badge for event status
  const getStatusBadge = () => {
    if (isOngoing) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          Happening Now
        </Badge>
      )
    } else if (isCompleted) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200">
          Completed
        </Badge>
      )
    } else if (isSoldOut) {
      return <Badge variant="destructive">Sold Out</Badge>
    } else if (isLowAvailability) {
      return (
        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
          Few Spots Left
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 hover:bg-green-100">
          {spotsLeft} Spots Left
        </Badge>
      )
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300",
        featured ? "md:flex md:h-[28rem]" : "h-full",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden group", featured ? "md:w-1/2 h-64 md:h-auto" : "h-56")}>
        <Link to={`/events/${event.slug}`} className="block h-full">
          <img
            src={event.imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={event.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
              "bg-muted",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {getStatusBadge()}
          {event.categoryId && (
            <Badge variant="secondary" className="capitalize bg-white/90 text-gray-800">
              {event.category?.name || "Category"}
            </Badge>
          )}
        </div>
      </div>

      <div className={cn("flex flex-col", featured ? "md:w-1/2 p-6 md:p-8" : "p-5")}>
        <CardContent className="p-0 pb-4">
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatEventDate(event.startsAt)}</span>
          </div>

          <Link to={`/events/${event.slug}`} className="block group">
            <h3
              className={cn(
                "font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2",
                featured ? "text-2xl" : "text-xl",
              )}
            >
              {event.title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>

          <div className="flex flex-wrap gap-y-3 mb-4">
            <div className="flex items-center text-sm text-muted-foreground mr-4">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>
                {event.capacity - spotsLeft}/{event.capacity} registered
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-amber-500 mb-3">
            <Star className="fill-current h-4 w-4" />
            <Star className="fill-current h-4 w-4" />
            <Star className="fill-current h-4 w-4" />
            <Star className="fill-current h-4 w-4" />
            <Star className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-700 ml-1">4.0</span>
          </div>

          {featured && event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="capitalize bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 pt-2 mt-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link to={`/events/${event.slug}`}>View Details</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default EventCard
