import {useMutation} from "@tanstack/react-query";
import {getTestAccessTokenFromServer} from "../services/login.service"

const useLogin = () => {
    return useMutation({
        mutationKey: ["useLogin"],
        mutationFn: getTestAccessTokenFromServer 
    })
}
export {useLogin}