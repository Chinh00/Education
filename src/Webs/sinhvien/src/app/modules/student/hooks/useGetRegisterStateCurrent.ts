import {useQuery} from "@tanstack/react-query";
import { getRegisterStateCurrent } from "../services/register.service";

const useGetRegisterStateCurrent = () => {
    return useQuery({
        queryKey: ["useGetRegisterStateCurrent"],
        queryFn: () => getRegisterStateCurrent()
    })
}
export { useGetRegisterStateCurrent }
