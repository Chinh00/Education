import {useQuery} from "@tanstack/react-query";
import {getEducations} from "../services/education.service.ts"
import {Query} from "@/infrastructure/query.ts";
const useGetEducations = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["educations", query],
        queryFn: () => getEducations(query),
        enabled: enable,
    })
}



export {useGetEducations}