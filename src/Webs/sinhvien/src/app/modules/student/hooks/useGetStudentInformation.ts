import { useQuery } from "@tanstack/react-query";
import { getStudentInformation } from "@/app/modules/student/services/student.service.ts";
const useGetStudentInformation = (refetchInterval: number | false = false, enable: boolean = true) => {
  return useQuery({
    queryKey: ["student"],
    queryFn: () => getStudentInformation(),
    refetchInterval: refetchInterval,
    enabled: enable
  })
}

export default useGetStudentInformation
