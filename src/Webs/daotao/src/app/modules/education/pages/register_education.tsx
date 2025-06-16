import { CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook";
import { useEffect } from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import { Box } from "@mui/material";
import {Register} from "@/domain/register_state.ts";
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
import {Table, Typography, type GetProp, type RadioChangeEvent, type TableProps } from 'antd';
import {IconButton} from "@mui/material";
import {Button} from "antd"
import { useNavigate } from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import dayjs from "dayjs";
import {History, ChartNoAxesCombined} from "lucide-react"
import { Badge } from "@/app/components/ui/badge";

const RegisterEducation = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách đăng ký học"}));
    }, []);
    const {data, isLoading, isSuccess, refetch} = useGetRegisters({})

    const nav = useNavigate();
    const columns: ColumnsType<Register> = [
        {
            title: 'Mã kì đăng ký học',
            dataIndex: "semesterCode",
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: "wishStartDate",
            render: (text, record) => (
                <div>{dayjs(record?.wishStartDate).format("HH:mm:ss DD-MM-YYYY", )}</div>
            )
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: "wishEndDate",
            render: (text, record) => (
                <div>{dayjs(record?.wishEndDate).format("HH:mm:ss DD-MM-YYYY", )}</div>

            )
        },
        {
            title: 'Trạng thái',
            dataIndex: "currentState",
            render: (text, record) => {
                switch (record?.currentState) {
                    case "Submitted": return <Badge className={"bg-blue-500"}>Đăng ký nguyện vọng</Badge>
                    case "Schedule": return <Badge className={"bg-blue-500"}>Lập thời khóa biểu</Badge>
                    case "StudentRegister": return <Badge className={"bg-blue-500"}>Sinh viên đăng ký học</Badge>
                    default: return <></> 
                }
            }
        },

    ];


    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box className={"flex flex-col gap-2"}>
                <Button color={"primary"} type={"primary"} className={"w-min"} onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} >Tạo mới</Button>
                
                <Table<Register>
                    rowKey={(c) => c.correlationId}
                    loading={isLoading}
                    
                    size={"small"}
                    bordered={true}
                    // pagination={true}
                    columns={columns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default RegisterEducation