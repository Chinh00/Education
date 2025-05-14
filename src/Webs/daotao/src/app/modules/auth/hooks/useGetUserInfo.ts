import {useQuery} from "@tanstack/react-query";
import { getUserInfo } from "../services/auth.service";

const useGetUserInfo = () => {
    return useQuery({
        queryKey: ["useGetUserInfo"],
        queryFn: () => getUserInfo()
    })
}

export {useGetUserInfo}