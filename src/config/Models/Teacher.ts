export interface ITeacher {
  id: number;
  teacher_code: string;
  name: string;
  nip: string | null;
  email: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  last_active?: string;
  classes?: Array<{ id: string | number; name?: string }>;
  password: string;
  password_confirmation: string;
}

export interface ErrorState{
    [key: string]: string | undefined;
}

export interface TeacherErrorState extends ErrorState{
  teacher_code?: string;
  name?: string;
  nip?: string;
  email?: string;
  classes?: string;
}