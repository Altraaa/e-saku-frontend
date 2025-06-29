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
      if (!student_id) {
        return Promise.resolve([]); // Menghindari request jika student_id tidak ada
      }
      return ApiAccomplishments.getByStudentId(student_id).catch((error) => {
        console.error("Error fetching accomplishments:", error);
        return []; // Mengembalikan array kosong jika terjadi error
      });
    },
    enabled: !!student_id, // Hanya aktif jika student_id ada
    retry: false, // Menghindari retry otomatis jika data tidak ditemukan
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
    onMutate: (id) => {
      // Optimistically update the cache to remove the deleted accomplishment
      queryClient.setQueryData<IAccomplishments[]>(
        ["accomplishmentsByStudent"],
        (oldData) => oldData?.filter((item) => item.id !== id) || []
      );
    },
    onSuccess: () => {
      // Invalidate the cache to ensure we get the updated data from the API
      queryClient.invalidateQueries({ queryKey: ["accomplishmentsByStudent"] });
    },
    onError: (error) => {
      console.error("Error deleting accomplishment:", error);
    },
  });
};
