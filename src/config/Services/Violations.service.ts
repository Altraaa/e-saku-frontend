import { IViolation } from "../Models/Violation";
import { ApiRequest } from "./Api.service";

export const ApiViolations = {
  getAll: (): Promise<IViolation[]> =>
    ApiRequest({ url: "/violations", method: "GET" }),
  getById: (id: number): Promise<IViolation> =>
    ApiRequest({ url: `/violations/${id}`, method: "GET" }),
  create: (data: Partial<IViolation>): Promise<IViolation> =>
    ApiRequest({ url: "/violations", method: "POST", body: data }),
  update: (id: number, data: Partial<IViolation>): Promise<IViolation> =>
    ApiRequest({ url: `/violations/${id}`, method: "PUT", body: data }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({ url: `/violations/${id}`, method: "DELETE" }),
};
