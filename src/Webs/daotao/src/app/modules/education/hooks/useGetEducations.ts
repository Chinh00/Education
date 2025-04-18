import {useQuery} from "@tanstack/react-query";
import {getEducations} from "../services/education.service.ts"
import {Query} from "@/infrastructure/query.ts";
const useGetEducations = (query: Query) => {
    return useQuery({
        queryKey: ["educations", query],
        queryFn: () => getEducations(query),
    })
}
export {useGetEducations}