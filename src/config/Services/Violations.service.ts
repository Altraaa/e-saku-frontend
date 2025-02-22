import { ApiRequest } from "./Api.service";

export const ApiViolations = {
  getAll: () => ApiRequest({ url: "/violations", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/violations/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/violations", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/violations/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/violations/${id}`, method: "DELETE" }),
};
