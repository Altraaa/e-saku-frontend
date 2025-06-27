import { IClassroom } from "./Classroom"
import { IStudent } from "./Student"
import { ITeacher } from "./Teacher"

export interface ITeacherReport {
    id: number
    student_id: number
    student?: IStudent
    reported_by: number 
    teacher_id: number
    teacher?: ITeacher
    reporter: ITeacher
    violation_details: string
    report_date: string
    classroom?: IClassroom
    created_at: string
    updated_at: string
}