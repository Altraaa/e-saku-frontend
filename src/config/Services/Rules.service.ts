import { ApiRequest } from "./Api.service";
import { IRules } from "../Models/Rules";

export const ApiRules = {
  getAll: (): Promise<IRules[]> => ApiRequest({ url: "/rules", method: "GET" }),
  getById: (id: number): Promise<IRules> =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "GET" }),
  create: (data: Partial<IRules>): Promise<IRules> =>
    ApiRequest({ url: "/rules", method: "POST", body: data }),
  update: (id: number, data: Partial<IRules>): Promise<IRules> =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "PUT", body: data }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({ url: `/rules-of-conduct/${id}`, method: "DELETE" }),
};
