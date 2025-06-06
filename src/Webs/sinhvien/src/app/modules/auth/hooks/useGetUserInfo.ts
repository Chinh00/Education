import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "../services/login.service"

const useGetUserInfo = (enable: boolean = true) => {
    return useQuery({
        queryKey: ["user-info"],
        queryFn: () => getUserInfo(),
        enabled: enable,
    })
}
export {useGetUserInfo}