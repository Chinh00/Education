import { useMutation } from "@tanstack/react-query"
import {createRegisterState} from "@/app/modules/education/services/education.service.ts";

const useCreateRegisterState = () => {
    return useMutation({
        mutationKey: ["createRegisterState"],
        mutationFn: createRegisterState,

    })
}
export {useCreateRegisterState}