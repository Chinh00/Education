import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getCourses, getDepartments, getSpecialities} from "./service";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Speciality} from "@/domain/speciality.ts";

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


export {
    useGetCourses,
    useGetDepartments,
    useGetSpecialityDepartments
};