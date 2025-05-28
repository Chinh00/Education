import { InformationBySchool } from "./information_by_school.model";
import { PersonalInformation } from "./personal_information.model.ts";
import { StudentEducationProgram } from "@/domain/student_education_program.ts";

export type Student = {
  personalInformation: PersonalInformation;
  informationBySchool: InformationBySchool;
  educationPrograms: StudentEducationProgram[];
  status: number;
  id: string;
  createdAt: string;
  updatedAt: string | null;

}
