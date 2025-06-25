import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";

const useGetCourseClasses = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetCourseClasses", query],
        queryFn: () => getCourseClasses(query),
        enabled: enable,
        staleTime: 0
    })
}

export {useGetCourseClasses};