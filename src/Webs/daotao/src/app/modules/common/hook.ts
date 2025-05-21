import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getBuildings, getCourses, getDepartments, getEventsStore, getRooms, getSpecialities, getSubjects} from "./service";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Speciality} from "@/domain/speciality.ts";
import {GetProp, TableProps } from "antd";

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

const useGetSpecialityDepartments = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["specialityDepartments", query],
        queryFn: () => getSpecialities(query),
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


const useGetBuildings = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["buildings", query],
        queryFn: () => getBuildings(query),
        enabled: enable,

    })
}

const useGetRooms = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["rooms", query],
        queryFn: () => getRooms(query),
        enabled: enable,

    })
}
const useGetEventsStore = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetEventsStore", query],
        queryFn: () => getEventsStore(query),
        enabled: enable,

    })
}


export {
    useGetCourses,
    useGetDepartments,
    useGetSpecialityDepartments,
    useGetSubjects,
    useGetBuildings,
    useGetRooms,
    useGetEventsStore
};


export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
