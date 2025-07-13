import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IType } from "../Models/AccomplismentsType";
import { ApiAccomplishmentsType } from "../Services/Accomplishments.service";

// Fetch all accomplishment types
export const useAccomplishmentsType = () => {
  return useQuery<IType[]>({
    queryKey: ["accomplishmentsType"],
    queryFn: () => ApiAccomplishmentsType.getAll(),
  });
};

// Fetch accomplishment type by ID
export const useAccomplishmentsTypeById = (id: number) => {
  return useQuery<IType>({
    queryKey: ["accomplishmentsType", id],
    queryFn: () => ApiAccomplishmentsType.getById(id),
    enabled: !!id,
  });
}

// Create a new accomplishment type
export const useAccomplishmentsTypeCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IType>) => ApiAccomplishmentsType.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomplishmentsType"] });
    },
    onError: (error) => {
      console.error("Error creating accomplishment type:", error);
    },
  });
}

// Update an existing accomplishment type
export const useAccomplishmentsTypeUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IType> }) =>
      ApiAccomplishmentsType.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomplishmentsType"] });
    },
    onError: (error) => {
      console.error("Error updating accomplishment type:", error);
    },
  });
}

// Delete an accomplishment type
export const useAccomplishmentsTypeDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiAccomplishmentsType.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accomplishmentsType"] });
    },
    onError: (error) => {
      console.error("Error deleting accomplishment type:", error);
    },
  });
}