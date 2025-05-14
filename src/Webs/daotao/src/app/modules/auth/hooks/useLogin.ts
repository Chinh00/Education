import { useMutation } from "@tanstack/react-query"
import {getTestAccessTokenFromServer} from "@/app/modules/auth/services/auth.service.ts";

const useLogin = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: getTestAccessTokenFromServer
    })
}

export {useLogin}