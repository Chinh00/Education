import {Query} from "@/infrastructure/query.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    createRegisterRegistrationPeriod,
    getConditions,
    getDepartments,
    getNotifications,
    getRooms,
    getStaffs
} from "./service";
import {GetProp, TableProps} from "antd";


const useGetDepartments = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["departments", query],
        queryFn: () => getDepartments(query),
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
    useGetDepartments,
    useGetRooms,
    useGetConditions,
    useGetStaffs,
    useGetNotifications,
    useCreateRegisterRegistrationPeriod
};


export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'> & {
    editable?: boolean;
}


export const getStageText = (stage: number) => {
    switch (stage) {
        case 0:
            return "GD1";
        case 1:
            return "GD2";
        case 2:
            return "GD1";
        case 3:
            return "GD2";
        case 4:
            return "2GD";
         
            
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