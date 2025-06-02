export interface ITeacherReport {
    id: number
    student_id: number
    reported_by: number 
    teacher_id: number
    violation_details: string
    report_date: string
    created_at: string
    updated_at: string
}