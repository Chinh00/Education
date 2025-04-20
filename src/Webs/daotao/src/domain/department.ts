import {Speciality} from "@/domain/speciality.ts";

export interface Department {
    departmentCode: string;
    departmentName: string;
    specialities: Speciality[];
    id: string;
    createdAt: string;
    updatedAt: string | null;
}