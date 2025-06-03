import { CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook";
import { useEffect } from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import { Box } from "@mui/material";
import {Register} from "@/domain/register_state.ts";
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
import {Table, Typography, type GetProp, type RadioChangeEvent, type TableProps } from 'antd';
import {IconButton, Button} from "@mui/material";
import { useNavigate } from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import dayjs from "dayjs";
import {History, ChartNoAxesCombined} from "lucide-react"

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
        },

        {
            title: 'Báo cáo',
            key: 'action',
            render: (_, record) => (
                <IconButton size={"small"} onClick={() => nav(`/register/state/${record?.semesterCode}`)}><ChartNoAxesCombined /></IconButton>
            ),
        },
        {
            title: 'Lịch sử',
            key: 'action',
            render: (_, record) => (
                <IconButton size={"small"} onClick={() => nav(`/history/RegisterConfig/${record?.eventStoreId}`)}><History /></IconButton>
            ),
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));


    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box>
                <Table<Register>
                    rowKey={(c) => c.correlationId}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                        <Button onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>
                    </Box>}
                    size={"small"}
                    bordered={true}
                    // pagination={true}
                    columns={tableColumns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default RegisterEducation