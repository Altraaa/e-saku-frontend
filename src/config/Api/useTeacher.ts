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

//update teacher
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

//update teacher password
export const useTeacherUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ITeacher> }) =>
      ApiTeachers.updatePassword(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", id] });
    },
  });
};

//upload profile image teacher
export const useTeacherUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      ApiTeachers.uploadPhoto(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", id] });
    },
  });
};

// delete profile image teacher
export const useTeacherDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiTeachers.deleteProfileImage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["teachers", id] });
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
