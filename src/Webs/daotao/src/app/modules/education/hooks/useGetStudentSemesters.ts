import {useQuery} from "@tanstack/react-query";
import {Query} from "@/infrastructure/query.ts";
import {getStudentSemesters} from "@/app/modules/education/services/courseClass.service.ts";
const useGetStudentSemesters = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetStudentSemesters", query],
        queryFn: () => getStudentSemesters(query),
        enabled: enable,
    })
}

export default useGetStudentSemesters