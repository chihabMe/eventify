// components/DashboardHeader.tsx
import { IUser } from '@/interfaces';
import { FC } from 'react';

interface OrganizerProfileDashboardProps {
  user: IUser;
}

const OrganizerProfileDashboard: FC<OrganizerProfileDashboardProps> = ({ user }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
      <p className="text-gray-500">
        Welcome back, {user.firstName} {user.lastName}
      </p>
    </div>
  );
};

export default OrganizerProfileDashboard;
