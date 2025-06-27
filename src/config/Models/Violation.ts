import { IRules } from "./Rules";
import { IStudent } from "./Student";

export interface IViolation {
    id: number;
    student_id: string;
    student?: IStudent;
    description: string;
    violation_date: string;
    teacher_id: number;
    action: string;
    points: number;
    rulesofconduct_id: number;
    rules_of_conduct: IRules;
    created_at: string;
    updated_at: string;
}