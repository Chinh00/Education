import {useMutation} from "@tanstack/react-query";
import { createRegisterWish } from "../services/register.service";

const useCreateRegisterWish = () => {
    return useMutation({
        mutationKey: ["useCreateRegisterWish"],
        mutationFn: createRegisterWish
    })
}
export {useCreateRegisterWish}