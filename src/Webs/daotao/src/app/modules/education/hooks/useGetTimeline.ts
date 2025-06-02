import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClassTimeline} from "@/app/modules/education/services/courseClass.service.ts";

const useGetTimeline = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["timeline", query],
        queryFn: () => getCourseClassTimeline(query),
        enabled: enable,
    })
}


export {useGetTimeline};