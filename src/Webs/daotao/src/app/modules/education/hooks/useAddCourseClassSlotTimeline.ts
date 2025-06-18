import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {addCourseClassSlotTimeline, updateCourseClass} from "@/app/modules/education/services/courseClass.service.ts";

const useAddCourseClassSlotTimeline = () => {
    return useMutation({
        mutationKey: ["useAddCourseClassSlotTimeline"],
        mutationFn: addCourseClassSlotTimeline,

    })
}
export {useAddCourseClassSlotTimeline}