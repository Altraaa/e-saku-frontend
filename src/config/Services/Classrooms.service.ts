import { ApiRequest } from "./Api.service";
import { IClassroom } from "../Models/Classroom";

export const ApiClassrooms = {
  getAll: (): Promise<IClassroom[]> =>
    ApiRequest({ url: "/classes", method: "GET" }),
  getById: (id: number): Promise<IClassroom> =>
    ApiRequest({ url: `/classes/${id}`, method: "GET" }),
  getByTeacherId: (teacher_id: number): Promise<IClassroom[]> =>
    ApiRequest({ url: `/classes/teacher/${teacher_id}`, method: "GET" }),
  getByMajorId: (major_id: number): Promise<IClassroom[]> =>
    ApiRequest({ url: `/classes/major/${major_id}`, method: "GET" }),
  create: (data: Partial<IClassroom>): Promise<IClassroom> =>
    ApiRequest({ url: "/classes", method: "POST", body: data }),
  update: (id: number, data: Partial<IClassroom>): Promise<IClassroom> =>
    ApiRequest({
      url: `/classes/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/classes/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
