import { HistorySemester } from "./history_semester.ts";
import { InformationBySchool } from "./information_by_school.ts";
import PersonalInformation from "./personal_information.ts";

export type Student = {
    personalInformation: PersonalInformation;
    informationBySchool: InformationBySchool;
    trainingPrograms: any; 
    historySemesters: HistorySemester[];
    id: string;
    createdAt: string; 
    updatedAt: string | null;

}