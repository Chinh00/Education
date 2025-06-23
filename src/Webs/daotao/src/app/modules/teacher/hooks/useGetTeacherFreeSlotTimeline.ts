import {useQuery} from "@tanstack/react-query";
import {getTeacherFreeSlotTimeline, TeacherFreeSlotTimeline} from "@/app/modules/teacher/services/teacher.service.ts";
const useGetTeacherFreeSlotTimeline = (query: TeacherFreeSlotTimeline, enable: boolean = true) => {
    return useQuery({
        queryKey: ["useGetTeacherFreeSlotTimeline", query],
        queryFn: () => getTeacherFreeSlotTimeline(query),
        enabled: enable,
    })
}
export {useGetTeacherFreeSlotTimeline}