import {useQuery} from "@tanstack/react-query";
import {getEducations} from "../services/education.service.ts"
import {Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Education} from "@/domain/education.ts";
const useGetEducations = (query: Query, enable: boolean = true, onSuccess?: (data: AxiosResponse<SuccessResponse<ListSuccessResponse<Education>>>) => void) => {
    return useQuery({
        queryKey: ["educations", query],
        queryFn: () => getEducations(query),
        enabled: enable,
        select: data => {
            onSuccess && onSuccess(data);
            return data
        }
    })
}





export {useGetEducations}