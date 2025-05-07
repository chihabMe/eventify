
import { axiosInstance as axios } from "@/lib/axiosClient";
// user.api.ts

export const fetchUsers = () => axios.get("/users").then(res => res.data);
export const fetchUser = (id: string) => axios.get(`/users/${id}`).then(res => res.data);
export const createUser = (data: any) => axios.post("/users", data);
export const updateUser = (id: string, data: any) => axios.put(`/users/${id}`, data);
export const deleteUser = (id: string) => axios.delete(`/users/${id}`);

