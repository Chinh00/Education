import {Query} from "@/infrastructure/query.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getStudentRegister,
    getSubjectTimelineConfig,
    updateSubjectTimelineConfig
} from "@/app/modules/education/services/education.service.ts";

const useUpdateSubjectTimelineConfig = () => {
    return useMutation({
        mutationKey: ["useUpdateSubjectTimelineConfig"],
        mutationFn: updateSubjectTimelineConfig
    })
}
export {useUpdateSubjectTimelineConfig}