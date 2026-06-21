// src/lib/axios-instances.ts
import { ACCESS_TOKEN_CONSTANT } from "./constants";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { notify } from "@/components/toast/NotifyToast";
import { queryClient } from "@/App";
import {
  createToken,
  getToken,
  isTokenExpiredClient,
  logoutClient,
  verifyRefreshToken,
} from "@/utils/token";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL is not defined. Make sure the environment variable is set before building the frontend."
  );
}

export const baseURL = apiUrl.replace(/\/$/, "") + "/api";

interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

const authInstance = axios.create({ baseURL }) as CustomAxiosInstance;
const baseInstance = axios.create({ baseURL }) as CustomAxiosInstance;

const getErrorMessage = (error: AxiosError): string => {
  if (!error.response) {
    return "Something went wrong!!!";
  }
  const data: any = error.response.data;
  const status = error.response.status;

  const statusHandlers: Record<number, () => string> = {
    400: () => {
      if (data.error) return data.error;
      if (data.details) return data.details;
      const keys = Object.keys(data);
      return keys.length > 0 ? data[keys[0]] : "Bad request";
    },
    401: () => data.detail || data.error || "Unauthorized",
    402: () => data.error || "Payment required",
    403: () => data.detail || data.error || "Forbidden",
    404: () => data.detail || data.error || "Not found",
    413: () => "File size is too large. Please upload a smaller file.",
    500: () => "Something went wrong!!!",
  };

  return statusHandlers[status]
    ? statusHandlers[status]()
    : "Something went wrong!!!";
};

baseInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const errorMessage = getErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  },
);

const attachAuthHeader = async (config: InternalAxiosRequestConfig) => {
  const accessToken = getToken(ACCESS_TOKEN_CONSTANT);
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
};

let refreshTokenPromise: Promise<string> | null = null;

const refreshToken = async (): Promise<string> => {
  if (refreshTokenPromise) {
    return refreshTokenPromise; // already refreshing
  }

  // eslint-disable-next-line no-async-promise-executor
  refreshTokenPromise = new Promise<string>(async (resolve) => {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const newToken = await verifyRefreshToken();
        createToken(ACCESS_TOKEN_CONSTANT, newToken);
        resolve(newToken);
        return;
      } catch (err) {
        attempt++;

        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, attempt * 500));
        }
      }
    }
    logoutClient();
    notify({
      title: "Session Expired",
      message: "Please log in again.",
      variant: "error",
    });
    queryClient.clear();
    window.location.href = "/login";
  }).finally(() => {
    refreshTokenPromise = null; // reset for next cycle
  });

  return refreshTokenPromise;
};

authInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getToken(ACCESS_TOKEN_CONSTANT);

    if (accessToken && isTokenExpiredClient(accessToken)) {
      try {
        // This will either start a new refresh or wait for existing one
        const newToken = await refreshToken();
        config.headers["Authorization"] = `Bearer ${newToken}`;
        console.log("THIS IS THE newToken");
        return config;
      } catch (error) {
        return attachAuthHeader(config);
      }
    }
    return attachAuthHeader(config);
  },
  (error) => Promise.reject(error),
);

// Response handling with retry on 401
authInstance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const authStore = useAuthStore.getState();
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return authInstance(originalRequest); // retry with new token
      } catch (error) {
        notify({
          title: "Session Expired",
          message: "Please log in again.",
          variant: "error",
        });
      }
    }

    const errorMessage = getErrorMessage(error);
    return Promise.reject(new Error(errorMessage));
  },
);

export { authInstance, baseInstance };
