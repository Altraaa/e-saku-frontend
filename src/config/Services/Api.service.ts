import axios, { AxiosRequestConfig } from "axios";

interface ApiRequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  authorization?: boolean;
  isMultipart?: boolean;
  isFormData?: boolean;
  customAuth?: boolean;
  onUploadProgress?: (progressEvent: {
    loaded: number;
    total?: number;
  }) => void;
  responseType?: "json" | "blob";
}

export const DefaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const customAuth = (config as AxiosRequestConfig & { customAuth?: boolean })
      .customAuth;

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
    if (
      error.response?.status === 401 &&
      !error.config.url?.endsWith("/logout")
    ) {
      localStorage.removeItem("token");
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
  onUploadProgress,
  responseType = "json",
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
      onUploadProgress: isFileUpload ? onUploadProgress : undefined,
      responseType,
    };

    const response = await axiosInstance.request(config);

    if (responseType === "blob") {
      return response.data;
    }

    if (!response?.data) {
      throw new Error("Invalid API response: No data returned.");
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("API Request Error:", error);
      throw error;
    }
    throw new Error("An unknown error occurred");
  }
};

export const logoutRequest = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
    return response.data;
  } catch (error) {
    // Silently handle errors
    return null;
  }
};
