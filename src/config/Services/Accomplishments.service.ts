import { ApiRequest } from "./Api.service";

export const ApiAccomplishments = {
  getAll: () => ApiRequest({ url: "/accomplishments", method: "GET" }),
  getById: (id: number) =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/accomplishments", method: "POST", body: data }),
  update: (id: number, data: any) =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "DELETE" }),
};
