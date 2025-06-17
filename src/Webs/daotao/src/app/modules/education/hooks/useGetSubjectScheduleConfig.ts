import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getSubjectRegister} from "@/app/modules/education/services/education.service.ts";
import {getSubjectScheduleConfig} from "@/app/modules/education/services/courseClass.service.ts";

const useGetSubjectScheduleConfig = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetSubjectScheduleConfig", query],
        queryFn: () => getSubjectScheduleConfig(query),
        enabled: enable,
    })
}
export {useGetSubjectScheduleConfig}