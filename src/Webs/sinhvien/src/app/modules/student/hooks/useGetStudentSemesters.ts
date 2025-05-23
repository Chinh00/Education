import {useQuery} from "@tanstack/react-query";
import {getStudentSemesters} from "@/app/modules/student/services/student.service.ts";
import {Query} from "@/infrastructure/query.ts";
const useGetStudentSemesters = (query: Query, enable: boolean) => {
    return useQuery({
        queryKey: ["useGetStudentSemesters", query],
        queryFn: () => getStudentSemesters(query),
        enabled: enable,
    })
}

export default useGetStudentSemesters