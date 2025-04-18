import {useQuery} from "@tanstack/react-query";
import getStudentInformation from "../services/student.service.ts"
const useGetStudentInformation = () => {
    return useQuery({
        queryKey: ["student"],
        queryFn: () => getStudentInformation()
    })
}

export default useGetStudentInformation