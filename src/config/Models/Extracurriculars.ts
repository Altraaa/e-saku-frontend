import { IStudent } from "./Student"

export interface IExtracurricular {
    id: number
    name: string
    description: string
    trainer: string
    status: string
    student_id: string,
    student?: IStudent
    created_at: string
    updated_at: string
};