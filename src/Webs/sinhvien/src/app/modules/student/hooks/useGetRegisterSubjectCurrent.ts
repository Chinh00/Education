import {useQuery} from "@tanstack/react-query";
import { getRegisterSubjectWish } from "../services/register.service";

const useGetRegisterSubjectCurrent = (educationCode: string, enable: boolean = true) => {
    return useQuery({
        queryKey: ["register"],
        queryFn: () => getRegisterSubjectWish(educationCode),
        enabled: enable,
    })
}
export {useGetRegisterSubjectCurrent}