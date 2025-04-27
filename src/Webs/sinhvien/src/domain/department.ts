import {Speciality} from "@/domain/speciality.ts";

export interface Department {
    departmentCode: string;
    departmentName: string;
    id: string;
    createdAt: string;
    updatedAt: string | null;
}