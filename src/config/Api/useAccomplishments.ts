import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAccomplishments } from "../Models/Accomplishments";
import { ApiAccomplishments } from "../Services/Accomplishments.service";

// Fetch all accomplishments
export const useAccomplishments = () => {
  return useQuery<IAccomplishments[]>({
    queryKey: ["accomplishments"],
    queryFn: () => ApiAccomplishments.getAll(),
  });
};

// Fetch accomplishment by ID
export const useAccomplishmentById = (id: number) => {
  return useQuery<IAccomplishments>({
    queryKey: ["accomplishment", id],
    queryFn: () => ApiAccomplishments.getById(id),
    enabled: !!id,
  });
};

// Fetch accomplishments by student ID
export const useAccomplishmentsByStudentId = (student_id: string) => {
  return useQuery<IAccomplishments[]>({
    queryKey: ["accomplishmentsByStudent", student_id],
    queryFn: () => {
      if (student_id === undefined) {
        return Promise.resolve([]);
      }
      return ApiAccomplishments.getByStudentId(student_id);
    },
    enabled: !!student_id,
  });
};

// Create accomplishment
export const useAccomplishmentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IAccomplishments>) =>
      ApiAccomplishments.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomplishments"] });
    },
    onError: (error) => {
      console.error("Error creating accomplishment:", error);
    },
  });
};

// Update accomplishment
export const useAccomplishmentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IAccomplishments>;
    }) => ApiAccomplishments.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["accomplishments"] });
      queryClient.invalidateQueries({ queryKey: ["accomplishment", id] });
    },
    onError: (error) => {
      console.error("Error updating accomplishment:", error);
    },
  });
};

// Delete accomplishment
export const useAccomplishmentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiAccomplishments.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<IAccomplishments[]>(
        ["accomplishments"],
        (oldData) => oldData?.filter((item) => item.id !== id) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting accomplishment:", error);
    },
  });
};