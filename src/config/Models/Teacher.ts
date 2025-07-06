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
