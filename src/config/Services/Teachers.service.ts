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
    ApiRequest({
      url: `/teachers/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  updatePassword: (
    id: string,
    data: Partial<ITeacher>
  ): Promise<{ message: string }> =>
    ApiRequest({
      url: `/teachers/${id}/update-password`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  uploadPhoto: (id: string, file: File): Promise<ITeacher> => {
    const formData = new FormData();
    formData.append("profile_image", file);

    return ApiRequest({
      url: `/teachers/${id}/upload-photo`,
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteProfileImage: (id: string): Promise<ITeacher> =>
    ApiRequest({
      url: `/teachers/${id}/photo`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
  delete: (id: number): Promise<{ message: string }> =>
    ApiRequest({
      url: `/teachers/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
