import { IStudent } from "./Student";

export interface IClassroom {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    students: IStudent;
}