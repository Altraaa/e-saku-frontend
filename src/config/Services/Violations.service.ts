import { IViolation } from "../Models/Violation";
import { ApiRequest } from "./Api.service";

export const ApiViolations = {
  getAll: (): Promise<IViolation[]> =>
    ApiRequest({ url: "/violations", method: "GET" }),
  getById: (id: number): Promise<IViolation> =>
    ApiRequest({ url: `/violations/${id}`, method: "GET" }),
  getByStudentId: (student_id: string): Promise<IViolation[]> =>
    ApiRequest({ url: `/violations/student/${student_id}`, method: "GET" }),
  getByTeacherId: (teacher_id: string): Promise<IViolation[]> =>
    ApiRequest({ url: `/violations/teacher/${teacher_id}`, method: "GET" }),
  create: (data: Partial<IViolation>): Promise<IViolation> =>
    ApiRequest({ url: "/violations", method: "POST", body: data }),
  uploadDocumentation: (id: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("image_documentation", file);

    return ApiRequest({
      url: `/violations/${id}/upload-documentation`,
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteDocumentation: (id: number): Promise<any> =>
    ApiRequest({
      url: `/violations/${id}/documentation`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
  update: (id: number, data: Partial<IViolation>): Promise<IViolation> =>
    ApiRequest({ url: `/violations/${id}`, method: "PUT", body: data }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/violations/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
