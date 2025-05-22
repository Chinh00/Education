import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "../services/login.service"

const useGetUserInfo = () => {
    return useQuery({
        queryKey: ["user-info"],
        queryFn: () => getUserInfo()
    })
}
export {useGetUserInfo}