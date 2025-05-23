import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getSemesters} from "@/app/modules/common/service.ts";
const useGetSemesters = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["semesters", query],
        queryFn: () => getSemesters(query),
        enabled: enable,
    })
}
export {useGetSemesters}