import {useQuery} from "@tanstack/react-query";
import { getRegisterWish } from "../services/register.service";

const useGetRegisterStateCurrent = () => {
    return useQuery({
        queryKey: ["useGetRegisterStateCurrent"],
        queryFn: () => getRegisterWish()
    })
}
export { useGetRegisterStateCurrent }
