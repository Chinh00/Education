import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import {useGetRegisterSates} from "@/app/modules/education/hooks/useGetRegisterSates.ts";
import { useGetStudentRegister } from "../hooks/useGetStudentRegister";
import {StudentRegister} from "@/domain/student_register.ts";
import { ColumnsType } from "../../common/hook";
import dayjs from "dayjs";
import {RegisterState} from "@/domain/register_state.ts";

const DashboardRegister = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Thống kê đăng ký học"}));
    }, []);
    const {data, isPending, isSuccess} = useGetStudentRegister({})



    const columns: ColumnsType<StudentRegister> = [
        {
            title: 'Mã sinh viên',
            dataIndex: "studentCode",
        },
        {
            title: 'Mã chương trình học',
            dataIndex: "educationCode",
        },
        {
            title: 'Thời gian đăng ký',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{dayjs(record?.registerDate).format("HH:mm:ss DD-MM-YYYY")}</div>
            )
        },
    ];

    const tableColumns = columns.map((item) => ({ ...item }));

    return <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
        <Box>

        </Box>
    </PredataScreen>
}
export default DashboardRegister