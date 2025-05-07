// axiosClient.ts
// import { API } from '@/constants';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';


export const axiosInstance: AxiosInstance = axios.create({
  withCredentials: true,
  timeout: 10000,
});

interface QueueItem {
  resolve: () => void;
  reject: (err: unknown) => void;
}

let isRefreshing = false;
let requestQueue: QueueItem[] = [];


axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // if it’s not a 401 or we already retried, just reject immediately
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // mark that we’re retrying this once
    originalRequest._retry = true;

    // if a refresh is already happening, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: () => {
            resolve(axiosInstance(originalRequest));
          },
          reject: (err) => {
            reject(err);
          },
        });
      });
    }

    // otherwise, start the refresh flow
    isRefreshing = true;

    // call the refresh endpoint directly—use a fresh axios so we don’t recurse
    return axios
      .post(`${API}/auth/token/refresh`, {}, { withCredentials: true })
      .then(() => {

        // replay all queued requests
        requestQueue.forEach((q) => q.resolve());
        requestQueue = [];

        // now retry the original request
        return axiosInstance(originalRequest);
      })
      .catch((refreshError) => {

        // reject all queued requests
        requestQueue.forEach((q) => q.reject(refreshError));
        requestQueue = [];

        // finally, reject this original request
        return Promise.reject(refreshError);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }
);
