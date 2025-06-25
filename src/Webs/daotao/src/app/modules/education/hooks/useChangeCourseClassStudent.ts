import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {changeCourseClassStudent} from "@/app/modules/education/services/courseClass.service.ts";

const useChangeCourseClassStudent = () => {
    return useMutation({
        mutationKey: ["useChangeCourseClassStudent"],
        mutationFn: changeCourseClassStudent,

    })
}
export {useChangeCourseClassStudent}