import { Query } from "@/infrastructure/query";
import {SuccessResponse, ListSuccessResponse } from "@/infrastructure/utils/success_response";
import { AxiosResponse } from "axios";
import {RegisterState} from "@/domain/register_state.ts";
import {getRegisterStates} from "@/app/modules/education/services/education.service.ts";
import {useQuery} from "@tanstack/react-query";

const useGetRegisterSates = (query: Query, enable: boolean = true, onSuccess?: (data: AxiosResponse<SuccessResponse<ListSuccessResponse<RegisterState>>>) => void) => {
    return useQuery({
        queryKey: ["registerStates", query],
        queryFn: () => getRegisterStates(query),
        enabled: enable,
        select: data => {
            onSuccess && onSuccess(data);
            return data
        }
    })
}
export { useGetRegisterSates }