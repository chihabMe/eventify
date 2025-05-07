"use client"

import type React from "react"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axiosClient"
import type { IEvent, IJsonResponse } from "@/interfaces"
import { Calendar, MapPin, Clock, Users, Star, ArrowRight, RefreshCw } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"

type FeaturedEventsProps = {}

const FeaturedEvents: React.FC<FeaturedEventsProps> = () => {
  const {
    data: eventsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["featuredEvents"],
    queryFn: () => axiosInstance.get<IJsonResponse<IEvent[]>>("/events?featured=true"),
  })

  if (isLoading) {
    return <EventsSkeleton />
  }

  if (isError) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <Card className="border-red-100 bg-red-50 p-8">
            <div className="text-center">
              <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to load events</h3>
              <p className="text-red-600 mb-4">
                There was a problem fetching the featured events. Please try again later.
              </p>
              <Button variant="destructive" onClick={() => refetch()} className="mt-2">
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  const featuredEvents = eventsData?.data.data || []

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 uppercase font-medium px-3">
              Featured
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">Featured Events</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our most popular upcoming experiences curated just for you
          </p>
        </div>

        {featuredEvents.length === 0 ? (
          <Card className="max-w-md mx-auto p-8">
            <div className="text-center">
              <p className="text-slate-500">No featured events available at the moment.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Event Card Component
const EventCard = ({ event }) => {
  const isCompleted = new Date(event.endsAt) < new Date()
  const isBooked = event.bookings && event.bookings.length > 0

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-slate-200 w-full">
      <div className="flex flex-col md:flex-row md:h-[280px]">
        {/* Image Section */}
        <div className="relative md:w-2/5 lg:w-1/3">
          <div className="h-[200px] md:h-full w-full overflow-hidden bg-slate-100">
            <img
              src={event.imageUrl || "/api/placeholder/600/800"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute top-0 left-0 p-3 flex gap-2">
            {event.featured && <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>}
            {isCompleted && (
              <Badge variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700">
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors mb-3">
              {event.title}
            </h3>
            <p className="text-slate-600 mb-6 line-clamp-3">
              {event.description ||
                "Join us for this exciting event and connect with like-minded individuals. Experience a day filled with engaging activities, networking opportunities, and memorable moments."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-slate-600">
                <Calendar className="h-5 w-5 mr-3 text-slate-400 flex-shrink-0" />
                <span>
                  {new Date(event.startsAt).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center text-slate-600">
                <MapPin className="h-5 w-5 mr-3 text-slate-400 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="h-5 w-5 mr-3 text-slate-400 flex-shrink-0" />
                <span>
                  {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                  {new Date(event.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center text-slate-600">
                <Users className="h-5 w-5 mr-3 text-slate-400 flex-shrink-0" />
                <span>{event.attendees || 0} attendees</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-start">
            {isCompleted && isBooked ? (
              <Button size="lg" className="group" variant="outline">
                <span>Leave Review</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Link to={`/events/${event.slug}`}>
                <Button size="lg" className="group" variant={isCompleted ? "outline" : "default"}>
                  <span>View Details</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Skeleton Loader Component
const EventsSkeleton = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-24 mx-auto mb-3" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto" />
        </div>

        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden w-full">
              <div className="flex flex-col md:flex-row md:h-[280px]">
                <div className="md:w-2/5 lg:w-1/3">
                  <Skeleton className="h-[200px] md:h-full w-full" />
                </div>
                <div className="flex-1 p-8">
                  <Skeleton className="h-8 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="flex items-center">
                        <Skeleton className="h-5 w-5 mr-3 rounded-full" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                    ))}
                  </div>

                  <Skeleton className="h-11 w-36 mt-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedEvents
