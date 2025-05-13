import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {useGetRegisterSates} from "@/app/modules/education/hooks/useGetRegisterSates.ts";
import { useGetStudentRegister } from "../hooks/useGetStudentRegister";
import {StudentRegister} from "@/domain/student_register.ts";
import { ColumnsType } from "../../common/hook";
import dayjs from "dayjs";
import {RegisterState} from "@/domain/register_state.ts";
import {Button, Space, Table, Typography} from "antd";
import { RoutePaths } from "@/core/route_paths";
import {Link, useNavigate } from "react-router";
import { EyeIcon } from "lucide-react"
import {DashboardState, setSemesterSelected} from "@/app/modules/education/stores/dashboard_register_slice.ts";
import SemesterSelect from "@/app/components/select/semester_select.tsx";
import {Query} from "@/infrastructure/query.ts";

const DashboardRegister = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Báo cáo đăng ký nguyện vọng học"}));
    }, []);

    const [studentRegisterQuery, setStudentRegisterQuery] = useState<Query>({

    })
    const {data, isPending, isSuccess} = useGetStudentRegister(studentRegisterQuery)



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
    const {semesterSelected} = useAppSelector<DashboardState>(c => c.dashboardRegister)




    const {data: registerState, isLoading, isSuccess: registerIsSuccess} = useGetRegisterSates({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterSelected!
            }
        ]
    }, semesterSelected !== undefined)

    useEffect(() => {
        if (semesterSelected !== undefined) {
            setStudentRegisterQuery(prevState => ({
                ...prevState,
                Filters: [
                    {
                        field: "CorrelationId",
                        operator: "==",
                        value: registerState?.data?.data?.items[0]?.correlationId ?? ""
                    }
                ]
            }))
        }
    }, [registerState, isLoading, registerIsSuccess]);


    return <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
        <Box className={"flex gap-5 flex-col"}>
            <SemesterSelect valueSelected={""} onChange={(value) => {
                dispatch(setSemesterSelected(value))
            }} />
            <Table<StudentRegister>
                rowKey={(c) => c.id}
                loading={isPending}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                    {/*<Button onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>*/}
                    <Typography>Tổng số sinh viên đăng ký: {data?.data?.data?.totalItems}</Typography>
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