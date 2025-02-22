import { ApiRequest } from "./Api.service";

export const ApiClassroom = {
  getAll: () => ApiRequest({ url: "/classes", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/classes/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/classes", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/classes/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/classes/${id}`, method: "DELETE" }),
};