import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getCourses, getDepartments} from "./service";

const useGetCourses = (query: Query) => {
    return useQuery({
        queryKey: ["course", query],
        queryFn: () => getCourses(query),
    })
}

const useGetDepartments = (query: Query) => {
    return useQuery({
        queryKey: ["departments", query],
        queryFn: () => getDepartments(query),
    })
}


export {
    useGetCourses,
    useGetDepartments
};