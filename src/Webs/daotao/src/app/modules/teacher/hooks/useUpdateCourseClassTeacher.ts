import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {createCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";
import {updateCourseClassTeacher} from "@/app/modules/teacher/services/teacher.service.ts";

const useUpdateCourseClassTeacher = () => {
    return useMutation({
        mutationKey: ["useUpdateCourseClassTeacher"],
        mutationFn: updateCourseClassTeacher,

    })
}
export {useUpdateCourseClassTeacher}