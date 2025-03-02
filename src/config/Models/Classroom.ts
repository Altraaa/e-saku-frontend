import { ITeacher } from "./Teacher";

export interface IClassroom {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    teacher_id: number;
    total_student: number;
    teacher: ITeacher;
}