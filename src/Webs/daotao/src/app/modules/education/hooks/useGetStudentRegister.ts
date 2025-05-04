import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getStudentRegister} from "@/app/modules/education/services/education.service.ts";

const useGetStudentRegister = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetStudentRegister", query],
        queryFn: () => getStudentRegister(query),
        enabled: enable,
    })
}
export {useGetStudentRegister}