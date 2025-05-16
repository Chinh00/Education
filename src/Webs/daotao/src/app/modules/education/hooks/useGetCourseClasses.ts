import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getCourseClasses} from "@/app/modules/education/services/courseClass.service.ts";

const useGetCourseClasses = (query: Query) => {
    return useQuery({
        queryKey: ["useGetCourseClasses", query],
        queryFn: () => getCourseClasses(query)
    })
}

export {useGetCourseClasses};