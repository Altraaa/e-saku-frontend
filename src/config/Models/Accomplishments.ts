import { IStudent } from "./Student";
import { IRank } from "./AccomplishmentsRanks";
import { IType } from "./AccomplismentsType";
import { ILevel } from "./AccomplishmentsLevel";


export interface IAccomplishments {
    id: number;
    student_id: string;
    type_id: IType
    // accomplishment_type: string;
    description: string;
    accomplishment_date: string;
    violation_date: string;
    level_id: ILevel;
    rank_id: IRank
    image_documentation: string | null;
    points: number;
    created_at: string;
    updated_at: string;
    student: IStudent;
}