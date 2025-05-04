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
import {Button, Space, Table } from "antd";
import { RoutePaths } from "@/core/route_paths";
import {Link, useNavigate } from "react-router";
import { EyeIcon } from "lucide-react"

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
        {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: (text, record) => (
                <Space size="middle">
                    <Link to={`/educations/register/${record?.studentCode}`}>
                        <Space>
                            Chi tiết
                            <EyeIcon />
                        </Space>
                    </Link>
                </Space>
            ),
        },
    ];

    const tableColumns = columns.map((item) => ({ ...item }));
    const nav = useNavigate();
    return <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
        <Box>
            <Table<StudentRegister>
                rowKey={(c) => c.id}
                loading={isPending}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                    {/*<Button onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>*/}
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
}
export default DashboardRegister