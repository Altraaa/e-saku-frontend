import { ApiRequest } from "./Api.service";
import { IMajor } from "../Models/Major";

export const ApiMajors = {
  getAll: (): Promise<IMajor[]> =>
    ApiRequest({ url: "/majors", method: "GET" }),

  getById: (id: number): Promise<IMajor> =>
    ApiRequest({ url: `/majors/${id}`, method: "GET" }),

  getWithClassrooms: (): Promise<IMajor[]> => // optionally define return type
    ApiRequest({ url: "/majors-with-classrooms", method: "GET" }),
};
