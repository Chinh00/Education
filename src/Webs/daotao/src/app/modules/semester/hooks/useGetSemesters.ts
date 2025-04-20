import {useQuery} from "@tanstack/react-query";
import {getSemesters} from "../services/semester.service.ts";
import {Query} from "@/infrastructure/query.ts";
const useGetSemesters = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["semesters", query],
        queryFn: () => getSemesters(query),
        enabled: enable,
    })
}
export {useGetSemesters}