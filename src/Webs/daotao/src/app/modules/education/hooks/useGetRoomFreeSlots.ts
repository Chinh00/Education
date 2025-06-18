import { Query } from "@/infrastructure/query";
import {SuccessResponse, ListSuccessResponse } from "@/infrastructure/utils/success_response";
import { AxiosResponse } from "axios";
import {Register} from "@/domain/register_state.ts";
import {getRegisters} from "@/app/modules/education/services/education.service.ts";
import {useQuery} from "@tanstack/react-query";
import {getRoomFreeSlots, SearchRoomFreeQueryModel} from "@/app/modules/education/services/courseClass.service.ts";

const useGetRoomFreeSlots = (query: SearchRoomFreeQueryModel, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetRoomFreeSlots", query],
        queryFn: () => getRoomFreeSlots(query),
        enabled: enable,
        staleTime: 0
    })
}

export { useGetRoomFreeSlots }