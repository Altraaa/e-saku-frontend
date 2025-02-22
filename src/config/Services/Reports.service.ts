import { ApiRequest } from "./Api.service";

export const ApiReports = {
  getAll: () => ApiRequest({ url: "/reports", method: "GET" }),
  create: (data: any) =>
    ApiRequest({ url: "/reports", method: "POST", body: data }),
  process: (id: number, data: any) =>
    ApiRequest({ url: `/reports/${id}/process`, method: "POST", body: data }),
};
