import { IBooking, IJsonResponse } from '@/interfaces';
import { axiosInstance as axios } from '@/lib/axiosClient';

export const fetchAllOrganizerBookings = async (eventId:string):Promise<IJsonResponse<IBooking[]>> => {
  if(!eventId){
    return {data:[]}

  }
  const response = await axios.get<IJsonResponse< IBooking[]>>(`/bookings/${eventId}`);
  if (response.status != 200) {
    return {data:[]} 
  }
  return response.data;
};
