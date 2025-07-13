import { ApiRequest, logoutRequest } from "./Api.service";
import { ILoginRequest } from "../Models/LoginRequest";

export const ApiAuth = {
  login: (data: ILoginRequest) =>
    ApiRequest({
      url: "/login",
      method: "POST",
      body: data,
      authorization: false,
    }),

  logout: async () => {
    try {
      await logoutRequest();
    } catch {
      // Silently handle errors
    }
  },
};
