import {Query} from "@/infrastructure/query.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getSubjects, updateSubjects} from "../services/subject.service";

const useGetSubjects = (query: Query, enable: boolean = true) => {
    return useQuery({
        queryKey: ["subjects", query],
        queryFn: () => getSubjects(query),
        enabled: enable,

    })
}
const useUpdateSubject = () => {
    return useMutation({
        mutationKey: ["updateSubject"],
        mutationFn: updateSubjects
    })
}


export {useGetSubjects, useUpdateSubject};