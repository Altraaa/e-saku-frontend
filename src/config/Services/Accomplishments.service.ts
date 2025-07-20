import { IAccomplishments } from "../Models/Accomplishments";
import { IType } from "../Models/AccomplismentsType";
import { ILevel } from "../Models/AccomplishmentsLevel";
import { IRank } from "../Models/AccomplishmentsRanks";
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
    id: string,
    data: Partial<IAccomplishments>
  ): Promise<IAccomplishments> =>
    ApiRequest({
      url: `/accomplishments/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  uploadDocumentation: (id: number, file: File): Promise<IAccomplishments> => {
    const formData = new FormData();
    formData.append("image_documentation", file);

    return ApiRequest({
      url: `/accomplishments/${id}/upload-documentation`,
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
  deleteDocumentation: (id: number): Promise<IAccomplishments> =>
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

export const ApiAccomplishmentsType = {
  getAll: (): Promise<IType[]> =>
    ApiRequest({ url: "/accomplishments-types", method: "GET" }),
  getById: (id: number): Promise<IType> =>
    ApiRequest({ url: `/accomplishments-types/${id}`, method: "GET" }),
  create: (data: Partial<IType>): Promise<IType> =>
    ApiRequest({ url: "/accomplishments-types", method: "POST", body: data }),
  update: (id: string, data: Partial<IType>): Promise<IType> =>
    ApiRequest({
      url: `/accomplishments-types/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: string): Promise<{ message: string }> =>
    ApiRequest({
      url: `/accomplishments-types/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};

export const ApiAccomplishmentsLevel = {
  getAll: (): Promise<ILevel[]> =>
    ApiRequest({ url: "/accomplishments-levels", method: "GET" }),
  getById: (id: number): Promise<ILevel> =>
    ApiRequest({ url: `/accomplishments-levels/${id}`, method: "GET" }),
  create: (data: Partial<ILevel>): Promise<ILevel> =>
    ApiRequest({ url: "/accomplishments-levels", method: "POST", body: data }),
  update: (id: string, data: Partial<ILevel>): Promise<ILevel> =>
    ApiRequest({
      url: `/accomplishments-levels/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: string): Promise<{ message: string }> =>
    ApiRequest({
      url: `/accomplishments-levels/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};

export const ApiAccomplishmentsRank = {
  getAll: (): Promise<IRank[]> =>
    ApiRequest({ url: "/accomplishments-ranks", method: "GET" }),
  getById: (id: number): Promise<IRank> =>
    ApiRequest({ url: `/accomplishments-ranks/${id}`, method: "GET" }),
  create: (data: Partial<IRank>): Promise<IRank> =>
    ApiRequest({ url: "/accomplishments-ranks", method: "POST", body: data }),
  update: (id: string, data: Partial<IRank>): Promise<IRank> =>
    ApiRequest({
      url: `/accomplishments-ranks/${id}`,
      method: "POST",
      body: { ...data, _method: "PUT" },
    }),
  delete: (id: string): Promise<{ message: string }> =>
    ApiRequest({
      url: `/accomplishments-ranks/${id}`,
      method: "POST",
      body: { _method: "DELETE" },
    }),
};
