import { ApiRequest } from "./Api.service";

export const ApiRules = {
  getAll: () => ApiRequest({ url: "/rules", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/rules", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "DELETE" }),
};
