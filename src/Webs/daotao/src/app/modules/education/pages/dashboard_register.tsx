import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import {useGetRegisterSates} from "@/app/modules/education/hooks/useGetRegisterSates.ts";

const DashboardRegister = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Thống kê đăng ký học"}));
    }, []);


    return <PredataScreen isLoading={false} isSuccess={true} >
        <Box></Box>
    </PredataScreen>
}
export default DashboardRegister