import { IClassroom } from "./Classroom";
import { IMajor } from "./Major";

export interface IStudent {
  id: number;
  name: string;
  nis: string;
  nisn: string;
  email?: string | null;
  place_of_birth: string;
  birth_date: string;
  gender: string;
  religion: string;
  height: string;
  weight: string;
  phone_number: string | null;
  address: string;
  sub_district: string;
  district: string;
  father_name: string;
  father_job: string;
  mother_name: string;
  mother_job: string;
  guardian_name: string | null;
  guardian_job: string | null;
  profile_image: string | null;
  point_total: number;
  created_at: string;
  updated_at: string;
  class_id: number;
  violations_sum_points: number;
  accomplishments_sum_points: number;
  classroom?: IClassroom[];
  major?: IMajor[];
}
