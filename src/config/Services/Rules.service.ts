import { ApiRequest } from "./Api.service";
import { IRules } from "../Models/Rules";

export const ApiRules = {
  getAll: (): Promise<IRules[]> =>
    ApiRequest({ url: "/rules-of-conduct", method: "GET" }),
  getById: (id: number): Promise<IRules> =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "GET" }),
  create: (data: Partial<IRules>): Promise<IRules> =>
    ApiRequest({ url: "/rules-of-conduct", method: "POST", body: data }),
  update: (id: string, data: Partial<IRules>): Promise<IRules> =>
    ApiRequest({
      url: `/rules-of-conduct/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/rules-of-conduct/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
