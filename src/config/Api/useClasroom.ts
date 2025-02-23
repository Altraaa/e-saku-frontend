import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IClassroom } from "../Models/Classroom";
import { ApiClassrooms } from "../Services/Classrooms.service";

//fetch all classroom
export const useClassroom = () => {
  return useQuery<IClassroom[]>({
    queryKey: ["classes"],
    queryFn: () => ApiClassrooms.getAll(),
  });
};

//fetch classroom by id
export const useClassroomById = (id: number) => {
  return useQuery<IClassroom>({
    queryKey: ["classes", id],
    queryFn: () => ApiClassrooms.getById(id),
    enabled: !!id,
  });
};

//create classroom
export const useClassroomCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ApiClassrooms.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

//upadate classroom
export const useClassroomUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IClassroom> }) =>
      ApiClassrooms.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", id] });
    },
  });
};

//delete classroom
export const useClassroomDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ApiClassrooms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
