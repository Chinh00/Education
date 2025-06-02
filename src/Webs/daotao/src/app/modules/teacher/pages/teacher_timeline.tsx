import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Input} from "antd"
const TeacherTimeline = () => {const dispatch = useAppDispatch();
    const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Thời khóa biểu giáo viên" }));
    }, []);
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <Input.Search size={"large"} placeholder={"Tìm theo mã giáo viên"} />
            </Box>
        </PredataScreen>
    )
}
export default TeacherTimeline;