import { HistorySemester } from "./history_semester.model";
import { InformationBySchool } from "./information_by_school.model";
import PersonalInformation from "./personal_information.model.ts";

export type Student = {
    personalInformation: PersonalInformation;
    informationBySchool: InformationBySchool;
    trainingPrograms: any; 
    historySemesters: HistorySemester[];
    id: string;
    createdAt: string; 
    updatedAt: string | null;

}