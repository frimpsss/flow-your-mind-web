import axios, { InternalAxiosRequestConfig } from "axios";
import { Cookies } from "react-cookie";

const cookie = new Cookies();

let isRefreshing = false;
let refreshQueue: (() => Promise<any>)[] = [];

export const _ = axios.create({
  baseURL: process.env.NEXT_PUBLIC_api_base_url as string,
  withCredentials: true,
});

_.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const access_token = cookie.get("user")?.token;

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    console.error("attach bearer token:", error);
    return Promise.reject(error);
  }
);

_.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response.data?.message === "expired_token" &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await getRefreshToken();
          cookie.set("user", {
            ...cookie.get("user"),
            token: newAccessToken,
          });

          // Retry the original request with the new token
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          processQueue(null, newAccessToken);
          return _(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          console.error("Failed to refresh access token: ", refreshError);
          window.location.href = "/login";
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If there is already a refresh request in progress, queue the original request
        return new Promise((resolve, reject) => {
          refreshQueue.push(async () => {
            try {
              const newAccessToken = await getRefreshToken();
              cookie.set("user", {
                ...cookie.get("user"),
                token: newAccessToken,
              });

              // Retry the original request with the new token
              originalRequest.headers.Authorization =
                "Bearer " + newAccessToken;
              const response = await _(originalRequest);
              resolve(response);
            } catch (refreshError) {
              console.error("Failed to refresh access token: ", refreshError);
              window.location.href = "/login";
              reject(error);
            }
          });
        });
      }
    } else if (error.response.status === 401 && !originalRequest?._retry) {
      // Handle 401 Unauthorized error
      cookie.remove("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Intercept option requests
_.interceptors.request.use(
  (config: any) => {
    if (config.method === "options") {
      return Promise.resolve({ status: 200 });
    }
    return config;
  },
  (error) => {
    console.error("option request:", error);
    return Promise.reject(error);
  }
);

// Function to get new refresh token
async function getRefreshToken() {
  try {
    const response = await _.get("/refresh");
    if (response?.data?.status) {
      return response?.data?.access_token;
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

const processQueue = (error: any, token: string | null) => {
  refreshQueue.forEach((callback: any) => {
    if (token) {
      callback(token);
    } else {
      callback(error);
    }
  });
  refreshQueue = [];
};
