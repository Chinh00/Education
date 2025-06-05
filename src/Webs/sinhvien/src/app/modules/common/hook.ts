import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getEducations, getNotifications, getSubjects} from "./service";


const useGetEducations = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["educations", query],
        queryFn: () => getEducations(query),
        enabled: enable,
    })
}
const useGetSubjects = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["subjects", query],
        queryFn: () => getSubjects(query),
        enabled: enable,

    })
}
const useGetNotifications = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["notifications", query],
        queryFn: () => getNotifications(query),
        enabled: enable,
        staleTime: 0
    })
}

export {
    useGetSubjects,
    useGetEducations,
    useGetNotifications
};