import {Query} from "@/infrastructure/query.ts";
import {useQuery} from "@tanstack/react-query";
import { getStudents } from "../services/student.service";

const useGetStudents = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["students", query],
        queryFn: () => getStudents(query),
        enabled: enable,
    })
}

export default useGetStudents;