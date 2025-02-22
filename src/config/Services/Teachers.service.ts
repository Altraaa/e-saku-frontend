import { ApiRequest } from "./Api.service";

export const ApiTeachers = {
  getAll: () => ApiRequest({ url: "/teachers", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/teachers/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/teachers", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/teachers/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/teachers/${id}`, method: "DELETE" }),
};
