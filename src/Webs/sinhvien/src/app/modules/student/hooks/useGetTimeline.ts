import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClassTimeline} from "@/app/modules/student/services/student.service.ts";

const useGetTimeline = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["timeline", query],
        queryFn: () => getCourseClassTimeline(query),
        enabled: enable,
    })
}
export {useGetTimeline};