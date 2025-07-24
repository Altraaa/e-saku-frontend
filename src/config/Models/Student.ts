import { IClassroom } from "./Classroom";
import { IMajor } from "./Major";

export interface IStudent {
  id: number;
  name: string;
  nis: string;
  nisn: string;
  email?: string;
  class_id?: number;
  major_id?: number;
  place_of_birth: string;
  birth_date: string;
  gender: string;
  religion: string;
  height: string;
  weight: string;
  phone_number: string;
  address: string | null;
  sub_district: string | null;
  district: string | null;
  father_name: string | null;
  father_job: string | null;
  mother_name: string | null;
  mother_job: string | null;
  guardian_name: string | null;
  guardian_job: string | null;
  profile_image: string | null;
  point_total: number;
  status: string;
  created_at: string;
  updated_at: string;
  violations_sum_points: number;
  accomplishments_sum_points: number;
  classroom?: IClassroom;
  major?: IMajor[];
}

export interface IStudentUpdatePassword extends IStudent {
  password: string;
  password_confirmation: string;
}

export interface IStudentUpdateStatus extends IStudent {
  status: string;
}
