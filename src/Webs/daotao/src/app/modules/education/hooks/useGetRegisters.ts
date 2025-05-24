import { Query } from "@/infrastructure/query";
import {SuccessResponse, ListSuccessResponse } from "@/infrastructure/utils/success_response";
import { AxiosResponse } from "axios";
import {Register} from "@/domain/register_state.ts";
import {getRegisters, getRegistersState} from "@/app/modules/education/services/education.service.ts";
import {useQuery} from "@tanstack/react-query";

const useGetRegisters = (query: Query, enable: boolean = true, onSuccess?: (data: AxiosResponse<SuccessResponse<ListSuccessResponse<Register>>>) => void) => {
    return useQuery({
        queryKey: ["registers", query],
        queryFn: () => getRegisters(query),
        enabled: enable,
        select: data => {
            onSuccess && onSuccess(data);
            return data
        }
    })
}
const useGetRegistersState = (query: Query, enable: boolean = true, onSuccess?: (data: AxiosResponse<SuccessResponse<ListSuccessResponse<Register>>>) => void) => {
    return useQuery({
        queryKey: ["registersState", query],
        queryFn: () => getRegistersState(query),
        enabled: enable,
        select: data => {
            onSuccess && onSuccess(data);
            return data
        }
    })
}
export { useGetRegisters, useGetRegistersState }