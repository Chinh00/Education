import {useMutation} from "@tanstack/react-query";
import {syncDataFromDataProvider} from "@/app/modules/student/services/student.service.ts";

const useSyncDataFromDataProvider = () => {
    return useMutation({
        mutationKey: ["useSyncDataFromDataProvider"],
        mutationFn: syncDataFromDataProvider
    })
}
export {
    useSyncDataFromDataProvider,
}