import { ApiRequest } from "./Api.service";

export const ApiAuth = {
  login: (data: any) =>
    ApiRequest({ url: "/login", method: "POST", body: data }),
  logout: () => ApiRequest({ url: "/logout", method: "POST" }),
};