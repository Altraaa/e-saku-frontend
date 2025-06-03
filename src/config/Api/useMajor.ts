import { useQuery } from "@tanstack/react-query";
import { ApiMajors } from "../Services/Major.service";

export const useMajors = () => {
  return useQuery({
    queryKey: ["majors"],
    queryFn: ApiMajors.getAll,
  });
};

export const useMajorById = (id: number) => {
  return useQuery({
    queryKey: ["major", id],
    queryFn: () => ApiMajors.getById(id),
    enabled: !!id,
  });
};

export const useMajorsWithClassrooms = () => {
  return useQuery({
    queryKey: ["majors-with-classrooms"],
    queryFn: ApiMajors.getWithClassrooms,
  });
};
