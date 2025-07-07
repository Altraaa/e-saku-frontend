import { ITeacherReport } from "../Models/TeacherReport";
import { ApiRequest } from "./Api.service";

export const ApiTeacherReports = {
  getAll: (): Promise<ITeacherReport[]> =>
    ApiRequest({ url: "/reports-teacher", method: "GET" }),
  getById: (id: number): Promise<ITeacherReport> =>
    ApiRequest({ url: `/reports-teacher/${id}`, method: "GET" }),
  getByTeacherId: (teacher_id: number): Promise<ITeacherReport[]> =>
    ApiRequest({ url: `/reports-teacher/teacher/${teacher_id}`, method: "GET" }),
  getByClassId: (class_id: number): Promise<ITeacherReport[]> =>
    ApiRequest({ url: `/reports-teacher/class/${class_id}`, method: "GET" }),
  getByDate: (date: string): Promise<ITeacherReport[]> =>
    ApiRequest({ url: `/reports-teacher/date/${date}`, method: "GET" }),
  getByDateAndClassId: (class_id: number, date: string): Promise<ITeacherReport[]> =>
    ApiRequest({
      url: `/reports-teacher/class/date/${class_id}/${date}`,
      method: "GET",
    }),
  getByReportedBy: (reported_by: number): Promise<ITeacherReport[]> =>
    ApiRequest({ url: `/reports-teacher/teacher/reported-by/${reported_by}`, method: "GET" }),
  create: (data: Partial<ITeacherReport>): Promise<ITeacherReport> =>
    ApiRequest({ url: "/reports-teacher", method: "POST", body: data }),
  update: (id: number, data: Partial<ITeacherReport>): Promise<ITeacherReport> =>
    ApiRequest({ url: `/reports-teacher/${id}`, method: "PUT", body: data }),
  processReport: (id: number): Promise<ITeacherReport> =>
    ApiRequest({ url: `/reports-teacher/process/${id}`, method: "POST" }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({ url: `/reports-teacher/${id}`, method: "POST", body: {_method: "DELETE"} }),
};
