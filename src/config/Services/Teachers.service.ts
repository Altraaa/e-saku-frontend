import { ITeacher } from "../Models/Teacher";
import { ApiRequest } from "./Api.service";

export const ApiTeachers = {
  getAll: (): Promise<ITeacher[]> =>
    ApiRequest({ url: "/teachers", method: "GET" }),
  getById: (id: number): Promise<ITeacher> =>
    ApiRequest({ url: `/teachers/${id}`, method: "GET" }),
  create: (data: Partial<ITeacher>): Promise<ITeacher> =>
    ApiRequest({ url: "/teachers", method: "POST", body: data }),
  update: (id: number, data: Partial<ITeacher>): Promise<ITeacher> =>
    ApiRequest({ url: `/teachers/${id}`, method: "PUT", body: data }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({ url: `/teachers/${id}`, method: "DELETE" }),
};
