import {useQuery} from "@tanstack/react-query";
import {getEducations} from "../services/education.service.ts"
import {Query} from "@/infrastructure/query.ts";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Education} from "@/domain/education.ts";
import {getSlotTimelineFree, GetSlotTimelineFreeQueryModel} from "@/app/modules/education/services/courseClass.service.ts";
const useGetSlotTimelineFree = (query: GetSlotTimelineFreeQueryModel, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetSlotTimelineFree", query],
        queryFn: () => getSlotTimelineFree(query),
        enabled: enable,
        
    })
}





export {useGetSlotTimelineFree}