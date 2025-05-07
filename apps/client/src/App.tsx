import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import UserProfile from './pages/UserProfile';
import OrganizerProfile from './pages/OrganizerProfile';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';
import { AuthContextProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute allowdRoles={['ADMIN']} >
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/profile" element={
              <ProtectedRoute allowdRoles={["USER"]}>
                <UserProfile />
              </ProtectedRoute>
            } />

            <Route path="/organizer/profile" element={
              <ProtectedRoute allowdRoles={["ORGANIZER"]}>
                <OrganizerProfile />
              </ProtectedRoute>
            } />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/events/create" element={
              <ProtectedRoute allowdRoles={["ORGANIZER"]}>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthContextProvider>
  </QueryClientProvider>
);

export default App;
