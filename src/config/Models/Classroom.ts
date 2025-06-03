import { IMajor } from "./Major";
import { IStudent } from "./Student";
import { ITeacher } from "./Teacher";

export interface IClassroom {
  id: number;
  name: string;
  teacher_id: number;
  total_student: number;
  major_id: number;
  teacher?: ITeacher;
  students?: IStudent[];
  major?: IMajor[];
  created_at: string;
  updated_at: string;
}