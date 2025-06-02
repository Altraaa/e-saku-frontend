import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITeacherReport } from "../Models/TeacherReport";
import { ApiTeacherReports } from "../Services/TeacherReports.service";

// Fetch all reports
export const useReports = () => {
  return useQuery<ITeacherReport[]>({
    queryKey: ["reports"],
    queryFn: () => ApiTeacherReports.getAll(),
  });
};

// Fetch report by ID
export const useReportById = (id: number) => {
  return useQuery<ITeacherReport>({
    queryKey: ["report", id],
    queryFn: () => ApiTeacherReports.getById(id),
    enabled: !!id,
  });
};

// Fetch reports by class ID
export const useReportsByClassId = (class_id: number) => {
  return useQuery<ITeacherReport[]>({
    queryKey: ["reports", "class", class_id],
    queryFn: () => ApiTeacherReports.getByClassId(class_id),
    enabled: !!class_id,
  });
};

// Fetch reports by date
export const useReportsByDate = (date: string) => {
  return useQuery<ITeacherReport[]>({
    queryKey: ["reports", "date", date],
    queryFn: () => ApiTeacherReports.getByDate(date),
    enabled: !!date,
  });
};

// Fetch reports by class ID and date
export const useReportsByClassIdAndDate = (class_id: number, date: string) => {
  return useQuery<ITeacherReport[]>({
    queryKey: ["reports", "class", class_id, "date", date],
    queryFn: () => ApiTeacherReports.getByDateAndClassId(class_id, date),
    enabled: !!(class_id && date),
  });
};

// Create report
export const useReportCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ITeacherReport>) => ApiTeacherReports.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error creating report:", error);
    },
  });
};

// Update report
export const useReportUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ITeacherReport> }) =>
      ApiTeacherReports.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", id] });
    },
    onError: (error) => {
      console.error("Error updating report:", error);
    },
  });
};

// Process report
export const useReportProcess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiTeacherReports.processReport(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["report", id], data);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Error processing report:", error);
    },
  });
};

// Delete report
export const useReportDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiTeacherReports.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ITeacherReport[]>(
        ["reports"],
        (oldData) => oldData?.filter((item) => item.id !== id) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting report:", error);
    },
  });
};
