import { ApiRequest } from "./Api.service";
import { ILoginRequest } from "../Models/LoginRequest";

export const ApiAuth = {
  login: (data: ILoginRequest) =>
    ApiRequest({
      url: "/login",
      method: "POST",
      body: data,
      authorization: false,
    }),

  logout: () => {
    // Get token before making the request
    const token = localStorage.getItem("token");

    return ApiRequest({
      url: "/logout",
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          }
        : {},
      customAuth: true,
    });
  },
};
