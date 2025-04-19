import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getCourses, getDepartments} from "./service";

const useGetCourses = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["course", query],
        queryFn: () => getCourses(query),
        enabled: enable,
    })
}

const useGetDepartments = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["departments", query],
        queryFn: () => getDepartments(query),
        enabled: enable,
    })
}


export {
    useGetCourses,
    useGetDepartments
};