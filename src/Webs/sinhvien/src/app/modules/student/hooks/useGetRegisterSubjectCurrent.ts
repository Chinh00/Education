import {useQuery} from "@tanstack/react-query";
import { getRegisterSubjectsCurrent } from "../services/register.service";

const useGetRegisterSubjectCurrent = (educationCode: string, enable: boolean = true) => {
    return useQuery({
        queryKey: ["register"],
        queryFn: () => getRegisterSubjectsCurrent(educationCode),
        enabled: enable,
    })
}
export {useGetRegisterSubjectCurrent}