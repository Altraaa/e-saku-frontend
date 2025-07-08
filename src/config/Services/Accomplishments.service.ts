import { IAccomplishments } from "../Models/Accomplishments";
import { ApiRequest } from "./Api.service";

export const ApiAccomplishments = {
  getAll: (): Promise<IAccomplishments[]> =>
    ApiRequest({ url: "/accomplishments", method: "GET" }),
  getById: (id: number): Promise<IAccomplishments> =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "GET" }),
  getByStudentId: (student_id: string): Promise<IAccomplishments[]> =>
    ApiRequest({
      url: `/accomplishments/student/${student_id}`,
      method: "GET",
    }),
  getByTeacherId: (teacher_id: string): Promise<IAccomplishments[]> =>
    ApiRequest({
      url: `/accomplishments/teacher/${teacher_id}`,
      method: "GET",
    }),
  create: (data: Partial<IAccomplishments>): Promise<IAccomplishments> =>
    ApiRequest({ url: "/accomplishments", method: "POST", body: data }),
  update: (
    id: number,
    data: Partial<IAccomplishments>
  ): Promise<IAccomplishments> =>
    ApiRequest({ url: `/accomplishments/${id}`, method: "PUT", body: data }),
  uploadDocumentation: (id: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("image_documentation", file);

    return ApiRequest({
      url: `/accomplishments/${id}/upload-documentation`,
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteDocumentation: (id: number): Promise<any> =>
    ApiRequest({
      url: `/accomplishments/${id}/documentation`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/accomplishments/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
