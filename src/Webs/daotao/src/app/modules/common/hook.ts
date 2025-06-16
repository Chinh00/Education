import {Query} from "@/infrastructure/query.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    createRegisterRegistrationPeriod,
    getBuildings,
    getConditions,
    getCourses,
    getDepartments,
    getEventsStore, getNotifications,
    getRooms, getStaffs
} from "./service";
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

const useGetConditions = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["conditions", query],
        queryFn: () => getConditions(query),
        enabled: enable,

    })
}

const useGetStaffs = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["staffs", query],
        queryFn: () => getStaffs(query),
        enabled: enable,

    })
}
const useGetNotifications = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["notifications", query],
        queryFn: () => getNotifications(query),
        enabled: enable,

    })
}



const useCreateRegisterRegistrationPeriod = () => {
    return useMutation({
        mutationKey: ["useCreateCourseClass"],
        mutationFn: createRegisterRegistrationPeriod,

    })
}


export {
    useGetCourses,
    useGetDepartments,
    useGetBuildings,
    useGetRooms,
    useGetEventsStore,
    useGetConditions,
    useGetStaffs,
    useGetNotifications,
    useCreateRegisterRegistrationPeriod
};


export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'> & {
    editable?: boolean;
}


export const getStageText = (semesterCode?: string) => {
    switch (semesterCode?.split("_")?.[3]) {
        case "1":
            return "Giai đoạn 1";
        case "2":
            return "Giai đoạn 2";
        default:
            return "Cả 2 giai đoạn";
    }
}

export const getStageValue = (semesterCode?: string) => {
    const stage = +(semesterCode ?? "1_1_1_1").split("_")[3];
    switch (stage) {
        case 1:
            return 0;
        case 2:
            return 1;
        default:
            return 2;
    }
}