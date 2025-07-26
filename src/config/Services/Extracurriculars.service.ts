import { IExtracurricular } from "../Models/Extracurriculars";
import { ApiRequest } from "./Api.service";

export const ApiExtracurriculars = {
  getAll: (): Promise<IExtracurricular[]> =>
    ApiRequest({ url: "/extracurriculars", method: "GET" }),
  getById: (id: number): Promise<IExtracurricular> =>
    ApiRequest({ url: `/extracurriculars/${id}`, method: "GET" }),
  getByStudentId: (student_id: string): Promise<IExtracurricular[]> =>
    ApiRequest({
      url: `/extracurriculars/student/${student_id}`,
      method: "GET",
    }),
  create: (data: Partial<IExtracurricular>): Promise<IExtracurricular> =>
    ApiRequest({ url: "/extracurriculars", method: "POST", body: data }),
  update: (
    id: number,
    data: Partial<IExtracurricular>
  ): Promise<IExtracurricular> =>
    ApiRequest({
      url: `/extracurriculars/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/extracurriculars/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
