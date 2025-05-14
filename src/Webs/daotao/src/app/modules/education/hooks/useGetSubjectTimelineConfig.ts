import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getStudentRegister, getSubjectTimelineConfig} from "@/app/modules/education/services/education.service.ts";

const useGetSubjectTimelineConfig = (subjectCode: string, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetSubjectTimelineConfig", subjectCode],
        queryFn: () => getSubjectTimelineConfig(subjectCode),
        enabled: enable,
    })
}
export {useGetSubjectTimelineConfig}