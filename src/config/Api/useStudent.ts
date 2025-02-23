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

//fetch student by id
export const useStudentById = (id: number) => {
  return useQuery<IStudent>({
    queryKey: ["student", id],
    queryFn: () => ApiStudents.getById(id),
    enabled: !!id,
  });
};

//create student
export const useStudentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiStudents.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

//upadate student
export const useStudentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IStudent> }) =>
      ApiStudents.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
  });
};

//delete student
export const useStudentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiStudents.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
