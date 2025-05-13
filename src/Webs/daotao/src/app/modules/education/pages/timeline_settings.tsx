import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box } from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";

const TimelineSettings = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Cấu hình thời khóa biểu"}));
    }, []);




    return (
        <PredataScreen isLoading={false} isSuccess={true} >
            <Box>
            </Box>
        </PredataScreen>
    )
}

export default TimelineSettings;