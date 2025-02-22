import { ApiRequest } from "./Api.service";

export const ApiStudents = {
  getAll: () => ApiRequest({ url: "/students", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/students/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/students", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/students/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/students/${id}`, method: "DELETE" }),
};
