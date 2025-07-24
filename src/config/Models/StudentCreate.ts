import { IStudent } from "./Student";

export interface IStudentCreate {
  name: string;
  nis: string;
  nisn: string;
  email?: string;
  class_id?: number;
  place_of_birth: string | null;
  birth_date: string | null;
  gender: string | null;
  religion: string | null;
  height: string | null;
  weight: string | null;
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
}

export interface CreateStudentResponse {
  message: string;
  student: IStudent;
}
