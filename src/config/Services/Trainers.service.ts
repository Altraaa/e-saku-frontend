import { ITrainer } from "../Models/Trainer";
import { ApiRequest } from "./Api.service";

export const ApiTrainers = {
  getAll: (): Promise<ITrainer[]> =>
    ApiRequest({ url: "/trainers", method: "GET" }),
  getById: (id: number): Promise<ITrainer> =>
    ApiRequest({ url: `/trainers/${id}`, method: "GET" }),
  create: (data: Partial<ITrainer>): Promise<ITrainer> =>
    ApiRequest({ url: "/trainers", method: "POST", body: data }),
  update: (id: number, data: Partial<ITrainer>): Promise<ITrainer> =>
    ApiRequest({
      url: `/trainers/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  updatePassword: (
    id: number,
    data: Partial<ITrainer>
  ): Promise<{ message: string }> =>
    ApiRequest({
      url: `/trainers/${id}/update-password`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/trainers/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
