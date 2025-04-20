import {useMutation} from "@tanstack/react-query";
import {createSemester} from "@/app/modules/semester/services/semester.service.ts";

const useCreateSemester = () => {
    return useMutation({
        mutationKey: ["useCreateSemester"],
        mutationFn: createSemester
    })
}
export default useCreateSemester