export interface ITeacher {
    id: number;
    teacher_code: string;
    name: string;
    nip: number | null;
    email: string | null;
    created_at: string;
    updated_at: string;
    last_active?: string;
}
