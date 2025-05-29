import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClasses} from "@/app/modules/student/services/student.service.ts";

const useGetCourseClasses = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetCourseClasses", query],
        queryFn: () => getCourseClasses(query),
        enabled: enable,
    })
}

export {useGetCourseClasses};