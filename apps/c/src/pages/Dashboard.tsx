
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Ticket,
  Calendar,
  Star,
  PenLine,
  Settings,
  Users,
  BarChart3,
  FilePenLine,
  TrashIcon,
  Download
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockEvents, mockBookings, mockStatistics } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import { Event, User as UserType, Booking, Statistics } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

// Helper for choosing random mock user based on role
const getRandomUser = (role: 'user' | 'organizer' | 'admin' = 'user'): UserType => {
  return mockUsers.find(user => user.role === role) || mockUsers[0];
};

const Dashboard = () => {
  const navigate = useNavigate();
  // For demo purposes, we'll mock different user roles
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("events");
  const [statistics, setStatistics] = useState<Statistics>(mockStatistics);

  // Simulate user authentication
  useEffect(() => {
    // For demo, allow selecting different user roles
    const demoUser = getRandomUser('admin');
    setCurrentUser(demoUser);

    // Load appropriate data based on user role
    if (demoUser.role === 'organizer') {
      // For organizers, show their events
      setUserEvents(mockEvents.filter(event => event.organizerId === demoUser.id));
    } else if (demoUser.role === 'user') {
      // For regular users, show their bookings
      const bookings = mockBookings.filter(booking => booking.userId === demoUser.id);
      setUserBookings(bookings);
      
      // Get event details for those bookings
      const bookedEventIds = bookings.map(booking => booking.eventId);
      setUserEvents(mockEvents.filter(event => bookedEventIds.includes(event.id)));
    }
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Handle logout
  const handleLogout = () => {
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  // Render dashboard based on user role
  const renderDashboardContent = () => {
    switch (currentUser.role) {
      case "admin":
        return renderAdminDashboard();
      case "organizer":
        return renderOrganizerDashboard();
      default:
        return renderUserDashboard();
    }
  };

  // User Dashboard
  const renderUserDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        
        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            {userBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userBookings.map(booking => {
                  const event = mockEvents.find(e => e.id === booking.eventId);
                  
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
                            <Button size="sm" variant="outline" className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              Download Ticket
                            </Button>
                            
                            {booking.status === 'confirmed' && (
                              <>
                                <Button size="sm" variant="outline" className="flex items-center">
                                  <PenLine className="h-4 w-4 mr-1" />
                                  Write Review
                                </Button>
                                <Button size="sm" variant="destructive" className="flex items-center">
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
      </>
    );
  };

  // Organizer Dashboard
  const renderOrganizerDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Events created
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userEvents.reduce((sum, event) => sum + event.bookedCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userEvents.length > 0 ? 
                  (userEvents.reduce((sum, event) => sum + event.rating, 0) / userEvents.length).toFixed(1) : 
                  "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                From {userEvents.reduce((sum, event) => sum + event.reviewCount, 0)} reviews
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Events</h2>
          <Button onClick={() => navigate("/events/create")}>Create New Event</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {userEvents.length > 0 ? (
            userEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
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
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p>{event.location}</p>
                    </div>
                    
                    <div className="mb-4 text-sm">
                      <span className="font-medium">Price:</span> ${event.price.toFixed(2)}
                      <span className="mx-3">|</span>
                      <span className="font-medium">Bookings:</span> {event.bookedCount} / {event.capacity}
                      <span className="mx-3">|</span>
                      <span className="font-medium">Status:</span> {event.isApproved ? "Approved" : "Pending Approval"}
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" variant="outline" className="flex items-center">
                        <FilePenLine className="h-4 w-4 mr-1" />
                        Edit Event
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Cancel Event
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Events Created</h3>
                <p className="text-muted-foreground mb-6">You haven't created any events yet.</p>
                <Button onClick={() => navigate("/events/create")}>Create Your First Event</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </>
    );
  };

  // Admin Dashboard
  const renderAdminDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${statistics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +23% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="events" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>
                  Approve or reject events created by organizers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-500">
                            By {event.organizerName} • {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant={event.isApproved ? "outline" : "default"}>
                          {event.isApproved ? "Approved" : "Approve"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  View and manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={user.avatar || "https://i.pravatar.cc/150"} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-500">
                            {user.email} • <span className="capitalize">{user.role}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        {user.role !== 'admin' && (
                          <Button size="sm" variant="destructive">
                            {user.isActive ? "Disable" : "Enable"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input defaultValue="Smart Event Booking System" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@sebs.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Require Event Approval</Label>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-gray-500">
                      When enabled, new events must be approved by an admin before becoming visible
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {currentUser.role === "admin"
              ? "Admin Dashboard"
              : currentUser.role === "organizer"
              ? "Organizer Dashboard"
              : "My Dashboard"}
          </h1>
          <p className="text-gray-500">
            Welcome back, {currentUser.name}
          </p>
        </div>
        
        {renderDashboardContent()}
      </div>
    </div>
  );
};

// Additional components used in Dashboard
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

const Switch = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative inline-block w-12 h-6">
    <input
      type="checkbox"
      className="opacity-0 w-0 h-0"
      {...props}
    />
    <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-colors duration-300 ${props.defaultChecked ? 'bg-primary' : ''}`}>
      <span className={`absolute h-5 w-5 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-300 ${props.defaultChecked ? 'transform translate-x-6' : ''}`} />
    </span>
  </div>
);

export default Dashboard;
