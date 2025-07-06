import axios, { AxiosRequestConfig } from "axios";

interface ApiRequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  params?: any;
  headers?: any;
  authorization?: boolean;
  isMultipart?: boolean;
  isFormData?: boolean;
  customAuth?: boolean;
}

export const DefaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}`
    : "https://saku.dev.smkn1denpasar.sch.id/api/",
  timeout: 50000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Special handling for logout endpoint
    if (config.url?.endsWith("/logout")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }

    // Normal request handling
    const token = localStorage.getItem("token");
    const customAuth = (config as any).customAuth;

    if (token && customAuth !== false) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // Special case: Don't clear token for logout 401 errors
      if (!error.config.url?.endsWith("/logout")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced ApiRequest function
export const ApiRequest = async ({
  url,
  method = "GET",
  body = null,
  params = {},
  headers = {},
  authorization = true,
  isMultipart = false,
  isFormData = false,
}: ApiRequestProps) => {
  try {
    const isFileUpload = isFormData || isMultipart;

    const finalHeaders = {
      ...headers,
      Accept: "application/json",
      ...(isFileUpload ? {} : { "Content-Type": "application/json" }),
      ...(authorization && localStorage.getItem("token")
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {}),
    };

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: finalHeaders,
      params,
      data: body ? (isFileUpload ? body : JSON.stringify(body)) : undefined,
    };

    const response = await axiosInstance.request(config);

    if (!response?.data) {
      throw new Error("Invalid API response: No data returned.");
    }

    return response.data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    throw error; 
  }
};
