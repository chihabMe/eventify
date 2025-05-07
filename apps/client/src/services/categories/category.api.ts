import { IEventCategory, IJsonResponse } from '@/interfaces';
import { axiosInstance as axios } from '@/lib/axiosClient';

export const getCategories = async () => {
  const response = await axios.get<IJsonResponse<IEventCategory[]>>(
    '/categories'
  );
  if (response.status != 200) {
    throw new Error("can't fetch categories");
  }
  return response.data.data;
};
