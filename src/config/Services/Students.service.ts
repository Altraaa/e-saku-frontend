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
  update: (id: string, data: IStudent) =>
    ApiRequest({
      url: `/students/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  uploadPhoto: (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("profile_image", file);

    return ApiRequest({
      url: `/students/${id}/upload-photo`,
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteProfileImage: (id: string): Promise<any> =>
    ApiRequest({
      url: `/students/${id}/photo`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
  delete: (id: number) =>
    ApiRequest({
      url: `/students/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
  deleteByClassId: (class_id: number) =>
    ApiRequest({
      url: `/students/class/${class_id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
