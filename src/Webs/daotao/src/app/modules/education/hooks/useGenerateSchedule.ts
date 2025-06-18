import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";
import {generateCourseClasses, generateSchedule} from "@/app/modules/education/services/courseClass.service.ts";

const useGenerateSchedule = () => {
    return useMutation({
        mutationKey: ["useGenerateSchedule"],
        mutationFn: generateSchedule,

    })
}
export {useGenerateSchedule}