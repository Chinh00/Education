import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {createCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";
import {
    generateTeacherForCourseClass,
    updateCourseClassTeacher
} from "@/app/modules/teacher/services/teacher.service.ts";

const useGenerateTeacherForCourseClass = () => {
    return useMutation({
        mutationKey: ["useGenerateTeacherForCourseClass"],
        mutationFn: generateTeacherForCourseClass,

    })
}
export {useGenerateTeacherForCourseClass}