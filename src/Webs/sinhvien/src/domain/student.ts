import { StudentEducationProgram } from "@/domain/student_education_program.ts";
import {PersonalInformation,  } from "./personal_information";
import { InformationBySchool } from "./information_by_school";

export type Student = {
  personalInformation: PersonalInformation;
  informationBySchool: InformationBySchool;
  educationPrograms: StudentEducationProgram[];
  status: number;
  id: string;
  createdAt: string;
  updatedAt: string | null;

}
