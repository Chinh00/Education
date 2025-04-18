import {useQuery} from "@tanstack/react-query";
import {getSemesters} from "../services/semester.service.ts";
import {Query} from "@/infrastructure/query.ts";
const useGetSemesters = (query: Query) => {
    return useQuery({
        queryKey: ["semesters", query],
        queryFn: () => getSemesters(query),
    })
}
export {useGetSemesters}