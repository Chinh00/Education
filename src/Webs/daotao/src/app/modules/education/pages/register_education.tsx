import { CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook";
import { useEffect } from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useGetRegisterSates} from "@/app/modules/education/hooks/useGetRegisterSates.ts";
import { Box } from "@mui/material";
import {RegisterState} from "@/domain/register_state.ts";
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
import {Table, Typography, type GetProp, type RadioChangeEvent, type TableProps } from 'antd';
import {Button} from "@/app/components/ui/button.tsx";
import { useNavigate } from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import dayjs from "dayjs";
const columns: ColumnsType<RegisterState> = [
    {
        title: 'Mã đăng ký học',
        dataIndex: "semesterCode",
    },
    {
        title: 'Thời gian bắt đầu',
        dataIndex: "startDate",
        render: (text, record) => (
            <div>{dayjs(record?.startDate).format("HH:mm:ss DD-MM-YYYY")}</div>
        )
    },
    {
        title: 'Thời gian kết thúc',
        dataIndex: "endDate",
        render: (text, record) => (
            <div>{dayjs(record?.endDate).format("HH:mm:ss DD-MM-YYYY")}</div>
        )
    },
    {
        title: 'Trạng thái',
        dataIndex: "currentState",
    },


    // {
    //     title: 'Action',
    //     key: 'action',
    //     sorter: true,
    //     render: () => (
    //         <Space size="middle">
    //             <a>Delete</a>
    //             <a>
    //                 <Space>
    //                     More actions
    //                     <DownOutlined />
    //                 </Space>
    //             </a>
    //         </Space>
    //     ),
    // },
];

const RegisterEducation = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách đăng ký học"}));
    }, []);
    const tableColumns = columns.map((item) => ({ ...item }));
    const {data, isLoading, isSuccess, refetch} = useGetRegisterSates({})

    const nav = useNavigate();
    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box>
                <Table<RegisterState>
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
                    // rowSelection={{
                    //     // onChange: (selectedRowKeys, selectedRows) => {
                    //     //     setDataAdd(prevState => [...selectedRows])
                    //     // },
                    // }}
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