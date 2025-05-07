import IUser from '@/interfaces/IUser';
import { axiosInstance } from '@/lib/axiosClient';

interface ILoginResponse {
  message: string;
  user: IUser;
}

export const loginService = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post<ILoginResponse>(
      '/auth/login',
      data
    );

    if (response.status != 200) {
      throw new Error('unable to login');
    }
    return response.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
