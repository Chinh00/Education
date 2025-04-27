export interface Speciality {
    id: string
    departmentCode: string;
    specialityCode: string;
    specialityName: string;
    specialityNameEng: string | null;
    specialityParentCode: number | null;
}