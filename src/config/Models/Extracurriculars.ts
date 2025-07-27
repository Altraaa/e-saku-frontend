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
  created_at?: string;
  updated_at?: string;
  students: {
    id: string;
    nis: string;
    name: string;
    nisn: string;
    class_id: number;
    classroom: {
      id: number;
      name: string;
      total_student: number;
    };
  };
  extracurricular: {
    id: number;
    name: string;
    trainer: string;
  };
}

export interface IChooseExtracurricular {
  id?: number;
  extracurricular_ids: number[];
}
