import { Query } from "@/infrastructure/query";
import {SuccessResponse, ListSuccessResponse } from "@/infrastructure/utils/success_response";
import { AxiosResponse } from "axios";
import {Register} from "@/domain/register_state.ts";
import {getRegisters} from "@/app/modules/education/services/education.service.ts";
import {useQuery} from "@tanstack/react-query";
import {
    GetCanBeCourseClasReplaceModel,
    getCourseClassCanBeReplace
} from "@/app/modules/education/services/courseClass.service.ts";

const useGetCourseClassCanBeReplace = (query: GetCanBeCourseClasReplaceModel, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetCourseClassCanBeReplace", query],
        queryFn: () => getCourseClassCanBeReplace(query),
        enabled: enable,
        
    })
}

export { useGetCourseClassCanBeReplace }