"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, MapPin, Save, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"
import { eventsQueryKeys, useCreateEventMutation } from "@/services/events/events.queries"
import { IEventCategory, IJsonResponse } from "@/interfaces" // Assuming these are correctly defined
import { axiosInstance } from "@/lib/axiosClient"
import { useQuery } from "@tanstack/react-query"
import { queryManager } from "@/services/query.manager"

// Schema for form validation
const eventFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  date: z.date({ required_error: "Event date is required" }),
  time: z.string().min(1, { message: "Event time is required" }), // Regex for HH:MM might be better e.g. .regex(/^([01]\d|2[0-3]):([0-5]\d)$/
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  category: z.string().min(1, { message: "Please select a category" }), // This will be categoryId
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  // categoryId: z.string().optional(), // This is covered by 'category' field now
  tags: z.string().optional(),
  // startsAt and endsAt are derived, not direct form inputs
})

type EventFormValues = z.infer<typeof eventFormSchema>

const CreateEvent: React.FC = () => {
  const navigate = useNavigate()
  const { mutateAsync: createEvent, isPending } = useCreateEventMutation()
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axiosInstance.get<IJsonResponse<IEventCategory[]>>(`/categories`),
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Effect for cleaning up Object URL
  useEffect(() => {
    const currentPreview = imagePreview
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview)
      }
    }
  }, [imagePreview])

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: "",
      location: "",
      category: "",
      capacity: 100,
      tags: "",
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Optional: Add validation for file type and size here
      // e.g. if (file.size > 5 * 1024 * 1024) { toast error, return }

      // Revoke the old preview URL if it exists
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = "" // Reset the file input
    }
  }

  const onSubmit = async (data: EventFormValues) => {
    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please upload an image for your event.",
        variant: "destructive",
      })
      return
    }

    try {
      const formData = new FormData()
      formData.append("image", imageFile)
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("location", data.location)

      const startDate = new Date(data.date)
      const [startHours, startMinutes] = data.time.split(":").map(Number)
      startDate.setHours(startHours, startMinutes, 0, 0) // Set seconds and ms to 0
      formData.append("startsAt", startDate.toISOString())

      const endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + 2) // Default 2 hour duration
      formData.append("endsAt", endDate.toISOString())

      if (data.tags) {
        const uniqTags = [...new Set(data.tags.split(",").map(tag => tag.trim()))].join(",");
        formData.append("tags", uniqTags)
      } else {
        formData.append("tags", "") // Or handle as per backend requirements for empty tags
      }
      formData.append("capacity", data.capacity.toString())
      formData.append("categoryId", data.category)

      await createEvent(formData, {
        onSuccess: () => {
          form.reset()
          setImageFile(null) // Clear image state
          setImagePreview(null) // Clear preview
          if (imageInputRef.current) {
            imageInputRef.current.value = ""
          }
          queryManager.invalidate(eventsQueryKeys.organizerEvents)
          queryManager.invalidate(eventsQueryKeys.organizerEventsStats)
          toast({
            title: "Event Created",
            description: "Your event has been created successfully.",
          })
          // navigate("/organizer/profile") // Uncomment if navigation is desired
        },
        onError: (error: any) => { // It's good to type the error if possible
          toast({
            title: "Failed to create event",
            description: error?.response?.data?.message || "Please check your event fields and try again.",
            variant: "destructive",
          })
        },
      })
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error creating event",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    navigate("/organizer/profile")
  }

  const categories = categoriesResponse?.data?.data;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormDescription>A catchy title for your event</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of your event"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed information about your event, activities, speakers, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!isLoadingCategories && categories && categories.map((category) => (
                                <SelectItem key={category.id} value={category.id} className="hover:!text-white cursor-pointer">
                                  {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                </SelectItem>
                              ))}
                              {isLoadingCategories && <SelectItem value="loading" disabled>Loading categories...</SelectItem>}
                            </SelectContent>
                          </Select>
                          <FormDescription>Choose the category that best fits your event</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Date, Time & Location */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Date, Time & Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                                className={cn("p-3")} // Removed pointer-events-auto, should be default
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Select the date when your event will take place</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Time</FormLabel>
                          <div className="relative w-full">
                            <FormControl>
                              <Input type="time" placeholder="Select time" {...field} />
                            </FormControl>
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          <FormDescription>The time when your event starts</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Location</FormLabel>
                        <div className="relative w-full">
                          <FormControl>
                            <Input placeholder="Enter event location" {...field} />
                          </FormControl>
                          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <FormDescription>The venue or address where the event will be held</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="100" {...field} />
                          </FormControl>
                          <FormDescription>Maximum number of attendees</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="music, outdoor, family-friendly (comma separated)" {...field} />
                        </FormControl>
                        <FormDescription>Add comma-separated tags to help people find your event</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Event Image</h2>
                  <div className="mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        className="hidden"
                        onChange={handleImageUpload}
                        ref={imageInputRef}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{imageFile ? "Change Image" : "Select Image"}</span>
                      </label>
                      <p className="text-sm text-muted-foreground mt-2">JPG, PNG, or GIF. Max 5MB recommended.</p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Preview</h3>
                      <div className="relative group w-full md:w-2/3 lg:w-1/2 mx-auto border rounded-md overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Event image preview"
                          className="w-full h-auto object-contain rounded-md aspect-video bg-slate-100" // aspect-video for 16:9, object-contain to see full image
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-700 transition-opacity opacity-80 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Debug Button (Optional) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 mb-4">
                  <Button
                    type="button"
                    onClick={() => {
                      console.log("Form values:", form.getValues())
                      console.log("Form errors:", form.formState.errors)
                      console.log("Image file:", imageFile)
                    }}
                    variant="outline"
                  >
                    Debug Form
                  </Button>
                </div>
              )}


              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || !form.formState.isDirty && !imageFile} className="gap-2">
                  {isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export default CreateEvent
