import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import {getSubjectRegister} from "@/app/modules/education/services/education.service.ts";

const useGetSubjectRegister = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetStudentRegister", query],
        queryFn: () => getSubjectRegister(query),
        enabled: enable,
    })
}
export {useGetSubjectRegister}