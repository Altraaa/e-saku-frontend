import { IStudent } from "./Student";

export interface IExtracurricular {
  id?: number;
  name: string;
  description: string;
  trainer: string;
  status: string;
  students_count?: number;
  student_id?: string;
  student?: IStudent;
  created_at?: string;
  updated_at?: string;
};

export interface IExtracurricularHistory {
  id?: number;
  student_id: string;
  extracurricular_id: number;
  registered_at: string;
  status: string;
  student?: IStudent;
  extracurricular?: IExtracurricular;
}

export interface IChooseExtracurricular {
  id?: number;
  extracurricular_ids: number[];
}
