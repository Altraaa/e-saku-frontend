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

export const useStudentsByClassId = (class_id: number) => {
  return useQuery<IStudent[]>({
    queryKey: ["students", "class", class_id],
    queryFn: () => ApiStudents.getByClassId(class_id),
    enabled: !!class_id, 
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
    onError: (error) => {
      console.error("Error creating student:", error);
    },
  });
};

//upadate student
export const useStudentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IStudent }) =>
      ApiStudents.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
    },
    onError: (error) => {
      console.error("Error updated student:", error);
    },
  });
};

//delete student
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
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
    },
  });
};
