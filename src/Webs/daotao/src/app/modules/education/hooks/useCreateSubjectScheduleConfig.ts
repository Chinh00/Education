﻿import {useMutation} from "@tanstack/react-query";
import {createSemester} from "@/app/modules/education/services/semester.service.ts";
import {createSubjectScheduleConfig} from "@/app/modules/education/services/courseClass.service.ts";

const useCreateSubjectScheduleConfig = () => {
    return useMutation({
        mutationKey: ["useCreateSubjectSchedule"],
        mutationFn: createSubjectScheduleConfig
    })
}
export default useCreateSubjectScheduleConfig