import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiStudents } from "../Services/Students.service";
import { IStudent } from "../Models/Student";

//fetch all student
export const useStudent = () => {
  return useQuery<IStudent[]>({
    queryKey: ["students"],
    queryFn: () => ApiStudents.getAll(),
  });
};

// Fetch student by id
export const useStudentById = (id: string) => {
  return useQuery<IStudent>({
    queryKey: ["student", id],
    queryFn: () => ApiStudents.getById(id),
    enabled: !!id,
  });
};

// Fetch students by class id
export const useStudentsByClassId = (class_id: number) => {
  return useQuery<IStudent[]>({
    queryKey: ["students", "class", class_id],
    queryFn: () => ApiStudents.getByClassId(class_id),
    enabled: !!class_id,
  });
};

// Create student
export const useStudentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IStudent) => ApiStudents.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Error creating student:", error);
    },
  });
};

// Update student
export const useStudentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IStudent }) =>
      ApiStudents.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id.toString()] });
    },
    onError: (error) => {
      console.error("Error updating student:", error);
    },
  });
};

// Upload student profile
export const useStudentUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      return ApiStudents.uploadPhoto(id, file);
    },

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["student", id.toString()] });
    },
  });
};

// Delete student profile
export const useStudentDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiStudents.deleteProfileImage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });
};

// Delete student
export const useStudentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiStudents.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        ["students"],
        (oldData: IStudent[] | undefined) =>
          oldData ? oldData.filter((student) => student.id !== id) : []
      );
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
    },
  });
};

export const useStudentDeleteByClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (class_id: number) => ApiStudents.deleteByClassId(class_id),
    onSuccess: (_, class_id) => {
      queryClient.setQueryData(
        ["students"],
        (oldData: IStudent[] | undefined) =>
          oldData
            ? oldData.filter((student) => student.class_id !== class_id)
            : []
      );
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
    },
  });
};
