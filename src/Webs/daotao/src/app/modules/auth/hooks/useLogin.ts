import { useMutation } from "@tanstack/react-query"
import {getAccessTokenFromServer, getTestAccessTokenFromServer} from "@/app/modules/auth/services/auth.service.ts";

const useLogin = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: getTestAccessTokenFromServer
    })
}

const useLoginMicrosoft = () => {
    return useMutation({
        mutationKey: ["useLoginMicrosoft"],
        mutationFn: getAccessTokenFromServer
    })
}
export {useLogin, useLoginMicrosoft}