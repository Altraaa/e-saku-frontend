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

    return ApiRequest({
      url: "/logout",
      method: "POST",
      authorization: false,
    });
  },
};
