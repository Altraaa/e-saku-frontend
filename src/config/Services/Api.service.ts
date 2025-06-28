import axios, { AxiosRequestConfig } from "axios";

interface ApiRequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  params?: any;
  headers?: any;
  authorization?: boolean;
  isMultipart?: boolean;
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
  headers: DefaultHeaders,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Cek config.customAuth, bukan header.authorization
    const customAuth = (config as any).customAuth;
    if (token && customAuth !== false) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
      return Promise.reject(new Error("Request timed out. Please try again."));
    }
    return Promise.reject(error);
  }
);

export const ApiRequest = async ({
  url,
  method = "GET",
  body = null,
  params = {},
  headers = DefaultHeaders,
  authorization = true,
  isMultipart = false,
}: ApiRequestProps) => {
  try {
    const finalHeaders = {
      ...headers,
      ...(authorization
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {}),
    };

    const requestBody = isMultipart ? body : JSON.stringify(body);

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: finalHeaders,
      params,
      data: body && requestBody,
    };

    const response = await axiosInstance.request(config);

    if (!response || !response.data) {
      throw new Error("Invalid API response: No data returned.");
    }

    return response.data;
  } catch (error: any) {
    console.error("API Request Error:", error);
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
};
