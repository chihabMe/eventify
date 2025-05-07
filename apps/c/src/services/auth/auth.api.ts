import IUser from '@/interfaces/IUser';
import { axiosInstance as axios } from '@/lib/axiosClient';

export const fetchProfile = async () => {
    const response = await axios.get<IUser | null>('/auth/me');
    return response.data;
};

export const logoutUser = async () => {
  try {
    await axios.post('/auth/logout');
  } catch (err) {
    console.error(err);
  } finally {
    return true;
  }
};
