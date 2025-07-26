import { IClassroom } from "./Classroom"
import { IRules } from "./Rules"
import { IStudent } from "./Student"
import { ITeacher } from "./Teacher"

export interface ITeacherReport {
  id: number;
  student_id: number;
  student?: IStudent;
  reported_by: number;
  teacher_id: number;
  teacher?: ITeacher;
  reporter: ITeacher;
  rulesofconduct_id: string[]; // Ubah menjadi array
  rules_of_conduct: IRules[];
  violation_date: string;
  violation_details: string;
  action: string;
  classroom?: IClassroom;
  created_at: string;
  updated_at: string;

  accomplishment_type?: string; // This will handle the type of achievement
  points?: number; // Points for the achievement
  rank?: string;
}