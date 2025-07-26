import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  IChooseExtracurricular,
  IExtracurricular,
  IExtracurricularHistory,
} from "../Models/Extracurriculars";
import { ApiExtracurriculars } from "../Services/Extracurriculars.service";

//fetch all extracurricular
export const useExtracurriculars = () => {
  return useQuery<IExtracurricular[]>({
    queryKey: ["extracurriculars"],
    queryFn: () => ApiExtracurriculars.getAll(),
  });
};

//fetch extracurricular history
export const useExtracurricularHistory = () => {
  return useQuery<IExtracurricularHistory[]>({
    queryKey: ["extracurriculars-history"],
    queryFn: () => ApiExtracurriculars.getAllHistory(),
  });
};

//fetch extracurricular by id
export const useExtracurricularById = (id: number) => {
  return useQuery<IExtracurricular>({
    queryKey: ["extracurricular", id],
    queryFn: () => ApiExtracurriculars.getById(id),
    enabled: !!id,
  });
};

//fetch by student id
export const useExtracurricularsByStudentId = (student_id: string) => {
  return useQuery<IExtracurricular[]>({
    queryKey: ["extracurricularsByStudent", student_id],
    queryFn: () => ApiExtracurriculars.getByStudentId(student_id),
    enabled: !!student_id,
    retry: false,
  });
};

export const useExtracurricularCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IExtracurricular>) =>
      ApiExtracurriculars.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
    onError: (error) => {
      console.error("Error creating extracurricular:", error);
    },
  });
};

export const useExtracurricularUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IExtracurricular>;
    }) => ApiExtracurriculars.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
      queryClient.invalidateQueries({ queryKey: ["extracurricular", id] });
    },
    onError: (error) => {
      console.error("Error updating extracurricular:", error);
    },
  });
};

export const useExtracurricularDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiExtracurriculars.delete(id),
    onMutate: (id) => {
      queryClient.setQueryData<IExtracurricular[]>(
        ["extracurriculars"],
        (oldData) => oldData?.filter((item) => item.id !== id) || []
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
    onError: (error) => {
      console.error("Error deleting extracurricular:", error);
    },
  });
};

export const useAssignExtracurricular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IChooseExtracurricular) =>
      ApiExtracurriculars.assignForMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myExtracurriculars"] });
      queryClient.invalidateQueries({
        queryKey: ["availableExtracurriculars"],
      });
    },
    onError: (error) => {
      console.error("Error assigning extracurricular:", error);
    },
  });
};

export const useExtracurricularExportSingle = () => {
  return async (extracurricularId: number) => {
    try {
      const extracurricular = await ApiExtracurriculars.getById(
        extracurricularId
      );

      if (!extracurricular?.name) {
        throw new Error("Nama ekstrakurikuler tidak ditemukan.");
      }

      const rawName = extracurricular.name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, "")
        .trim();

      const capitalized =
        rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/\s+/g, "_");

      const fileName = `Ekstrakurikuler ${capitalized} - ${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      const response = await ApiExtracurriculars.exportSingleExtracurricular(
        extracurricularId
      );
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengekspor data ekstrakurikuler:", error);
      throw error;
    }
  };
};
