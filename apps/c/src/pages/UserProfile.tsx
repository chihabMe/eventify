
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Ticket,
  Calendar,
  Star,
  PenLine,
  Download
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockEvents, mockBookings } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import { Event, User as UserType, Booking } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [bookedEvents, setBookedEvents] = useState<{[key: string]: Event}>({});
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    // Mock current user - in a real app, this would come from auth context
    const mockRegularUser = mockUsers.find(user => user.role === 'user');
    
    if (mockRegularUser) {
      setCurrentUser(mockRegularUser);
      
      // Get bookings for this user
      const userBookings = mockBookings.filter(
        booking => booking.userId === mockRegularUser.id
      );
      setUserBookings(userBookings);
      
      // Get event details for those bookings
      const eventDetails: {[key: string]: Event} = {};
      userBookings.forEach(booking => {
        const event = mockEvents.find(e => e.id === booking.eventId);
        if (event) {
          eventDetails[booking.eventId] = event;
        }
      });
      setBookedEvents(eventDetails);
    } else {
      // Redirect if no user found
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const handleDownloadTicket = (booking: Booking) => {
    toast({
      title: "Ticket Downloaded",
      description: "Your ticket has been successfully downloaded."
    });
    // In a real application, this would generate and download a PDF
    console.log(`Downloading ticket for booking: ${booking.id}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled."
    });
    
    // Update booking status in state
    setUserBookings(prev => 
      prev.map(b => 
        b.id === bookingId 
          ? {...b, status: 'cancelled' as 'cancelled' | 'confirmed' | 'pending'} 
          : b
      )
    );
  };

  const handleWriteReview = (eventId: string) => {
    navigate(`/events/${eventId}/review`);
  };

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {currentUser.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Events booked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userBookings.filter(b => b.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Events to attend
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Written</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Reviews submitted
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="bookings" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            {userBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userBookings.map(booking => {
                  const event = bookedEvents[booking.eventId];
                  
                  if (!event) return null;
                  
                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-3/4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-500 mb-4">
                            <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                            <p>{event.location}</p>
                          </div>
                          
                          <div className="mb-4 text-sm">
                            <span className="font-medium">Tickets:</span> {booking.ticketCount}
                            <span className="mx-3">|</span>
                            <span className="font-medium">Total:</span> ${booking.totalPrice.toFixed(2)}
                            <span className="mx-3">|</span>
                            <span className="font-medium">Booked on:</span> {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            {booking.status === 'confirmed' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-2"
                                onClick={() => handleDownloadTicket(booking)}
                              >
                                <Download className="h-4 w-4" />
                                Download Ticket
                              </Button>
                            )}
                            
                            {booking.status === 'confirmed' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex items-center gap-2"
                                  onClick={() => handleWriteReview(event.id)}
                                >
                                  <PenLine className="h-4 w-4" />
                                  Write Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel Booking
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Bookings Yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't booked any events yet.</p>
                  <Button onClick={() => navigate("/events")}>Browse Events</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                        <img
                          src={currentUser.avatar || "https://i.pravatar.cc/150"}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="secondary" 
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <PenLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input defaultValue={currentUser.name} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue={currentUser.email} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" defaultValue="********" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// UI Components
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
    {...props}
  />
);

export default UserProfile;
