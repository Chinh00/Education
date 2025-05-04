import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import { getStudents } from "../services/student.service";
import {AxiosResponse} from "axios";
import {ListSuccessResponse, SuccessResponse} from "@/infrastructure/utils/success_response.ts";
import {Student} from "@/domain/student.ts";

const useGetStudents = (query: Query, enable: boolean = true, onSuccess: (data: AxiosResponse<SuccessResponse<ListSuccessResponse<Student>>>) => void = () => {}
) => {
    return useQuery({
        queryKey: ["students", query],
        queryFn: () => getStudents(query),
        enabled: enable,
        select: data => {
            onSuccess(data)
            return data
        }
    })
}

export default useGetStudents;