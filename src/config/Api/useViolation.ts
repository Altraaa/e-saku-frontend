import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IViolation } from "../Models/Violation";
import { ApiViolations } from "../Services/Violations.service";

// Fetch all violations
export const useViolations = () => {
  return useQuery<IViolation[]>({
    queryKey: ["violations"],
    queryFn: () => ApiViolations.getAll(),
  });
};

// Fetch violation by ID
export const useViolationById = (id: number) => {
  return useQuery<IViolation>({
    queryKey: ["violation", id],
    queryFn: () => ApiViolations.getById(id),
    enabled: !!id,
  });
};

// Create violation
export const useViolationCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IViolation>) => ApiViolations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      console.error("Error creating violation:", error);
    },
  });
};

// Update violation
export const useViolationUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IViolation> }) =>
      ApiViolations.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["violation", id] });
    },
    onError: (error) => {
      console.error("Error updating violation:", error);
    },
  });
};

// Delete violation
export const useViolationDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiViolations.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<IViolation[]>(
        ["violations"],
        (oldData) => oldData?.filter((item) => item.id !== id) || []
      );
    },
    onError: (error) => {
      console.error("Error deleting violation:", error);
    },
  });
};
