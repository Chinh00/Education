import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getDepartments, getEducations, getNotifications, getSpecialities, getSubjects} from "./service";



const useGetDepartments = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["departments", query],
        queryFn: () => getDepartments(query),
        enabled: enable,
    })
}

const useGetSpecialityDepartments = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["specialityDepartments", query],
        queryFn: () => getSpecialities(query),
        enabled: enable,
    })
}

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
    useGetDepartments,
    useGetSpecialityDepartments,
    useGetSubjects,
    useGetEducations,
    useGetNotifications
};