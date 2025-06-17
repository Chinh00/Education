import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {generateCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";

const useGenerateCourseClasses = () => {
    return useMutation({
        mutationKey: ["useGenerateCourseClasses"],
        mutationFn: generateCourseClasses,

    })
}
export {useGenerateCourseClasses}