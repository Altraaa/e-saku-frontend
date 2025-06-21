import { IStudent } from "../Models/Student";
import { ApiRequest } from "./Api.service";

export const ApiStudents = {
  getAll: () => ApiRequest({ url: "/students", method: "GET" }),
  getById: (id: string) =>
    ApiRequest({ url: `/studentsId/${id}`, method: "GET" }),
  getByClassId: (class_id: number) =>
    ApiRequest({ url: `/students/class/${class_id}`, method: "GET" }),
  create: (data: IStudent) =>
    ApiRequest({ url: "/students", method: "POST", body: data }),
  update: (id: number, data: IStudent) =>
    ApiRequest({ url: `/students/${id}`, method: "PUT", body: data }),
  delete: (id: number) =>
    ApiRequest({ url: `/students/${id}`, method: "POST", body: {_method: "DELETE"} }),
};
