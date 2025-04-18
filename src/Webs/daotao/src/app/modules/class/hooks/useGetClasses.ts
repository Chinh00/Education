import { getClassManagers } from "../services/class.service";
import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";


const useGetClasses = (query: Query) => {
    return useQuery({
        queryKey: ["classes", query],
        queryFn: () => getClassManagers(query),
    })
}

export { useGetClasses };