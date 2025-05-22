import { HistorySemester } from "./history_semester.ts";
import { InformationBySchool } from "./information_by_school.ts";
import PersonalInformation from "./personal_information.ts";
import {StudentEducationProgram} from "@/domain/student_education_program.ts";

export type Student = {
    personalInformation: PersonalInformation;
    informationBySchool: InformationBySchool;
    educationPrograms: StudentEducationProgram[];
    id: string;
    createdAt: string; 
    updatedAt: string | null;

}