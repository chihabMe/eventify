// OrganizerDashboard.tsx - Main container component
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import OrganizerProfileDashboard from "@/components/OrganizerProfileHeader";
import OrganizerProfileDashboardStats from "@/components/OrganizerProfileDashboardStats";
import OrganizerEventsBookingsTabs from "@/components/OrganizerEventsBookingTabs";

const OrganizerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("events");

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <OrganizerProfileDashboard user={user} />
        <OrganizerProfileDashboardStats />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Events</h2>
          <button
            onClick={handleCreateEvent}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
            </svg>
            Create New Event
          </button>
        </div>

        <OrganizerEventsBookingsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default OrganizerProfile;
