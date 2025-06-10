import { IRules } from "./Rules";

export interface IViolation {
    id: number;
    student_id: string;
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