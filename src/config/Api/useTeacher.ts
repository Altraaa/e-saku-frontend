import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiTeachers } from "../Services/Teachers.service";
import { ITeacher } from "../Models/Teacher";

//fetch all teacher
export const useTeacher = () => {
  return useQuery<ITeacher[]>({
    queryKey: ["teachers"],
    queryFn: () => ApiTeachers.getAll(),
  });
};

//fetch teacher by id
export const useTeacherById = (id: number) => {
  return useQuery<ITeacher>({
    queryKey: ["teachers", id],
    queryFn: () => ApiTeachers.getById(id),
    enabled: !!id,
  });
};

//create teacher
export const useTeacherCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiTeachers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

//upadate teacher
export const useTeacherUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ITeacher> }) =>
      ApiTeachers.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
    },
  });
};

//delete teacher
export const useTeacherDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiTeachers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
