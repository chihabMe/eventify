export default interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  role: 'ORGANIZER' | 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
}
