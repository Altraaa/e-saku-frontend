import { IAccomplishments } from "../Models/Accomplishments";
import { ApiRequest } from "./Api.service";

export const ApiAccomplishments = {
  getAll: (): Promise<IAccomplishments[]> =>
    ApiRequest({ url: "/accomplishments", method: "GET" }),
  getById: (id: number): Promise<IAccomplishments> =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "GET" }),
  getByStudentId: (student_id: string): Promise<IAccomplishments[]> =>
    ApiRequest({ url: `/accomplishments/student/${student_id}`, method: "GET" }),
  create: (data: Partial<IAccomplishments>): Promise<IAccomplishments> =>
    ApiRequest({ url: "/accomplishments", method: "POST", body: data }),
  update: (
    id: number,
    data: Partial<IAccomplishments>
  ): Promise<IAccomplishments> =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "PUT", body: data }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "POST", body: {_method: "DELETE"} }),
};
