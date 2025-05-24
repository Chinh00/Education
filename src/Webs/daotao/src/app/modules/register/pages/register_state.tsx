import {Link, useNavigate, useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {StudentRegister} from "@/domain/student_register.ts";
import dayjs from "dayjs";
import {Space, Steps, Table, Typography} from "antd";
import {EyeIcon} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";
import {useGetRegisterSates} from "@/app/modules/education/hooks/useGetRegisterSates.ts";
import {useGetStudentRegister} from "@/app/modules/education/hooks/useGetStudentRegister.ts";
import {Box} from "@mui/material";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";

const RegisterState = () => {
    const {semester} = useParams()
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Báo cáo đăng ký nguyện vọng học kì ${semester}`}));
    }, []);

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


    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            }
        ]
    })
    const {data: registerState, isLoading, isSuccess: registerIsSuccess} = useGetRegisterSates(query, semester !== undefined)
    useEffect(() => {
        if (registerState) {
            setStudentRegisterQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(c => c.field !== "CorrelationId") ?? [],
                    {
                        field: "CorrelationId",
                        operator: "==",
                        value: registerState?.data?.data?.items[0]?.correlationId
                    }
                ]
            }))
        }
    }, [registerState]);
    const [studentRegisterQuery, setStudentRegisterQuery] = useState<Query>({

    })
    const {data, isPending, isSuccess} = useGetStudentRegister(studentRegisterQuery)


    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
            <Box className={"flex gap-5 flex-col"}>
                <Table<StudentRegister>
                    rowKey={(c) => c.id}
                    loading={isPending}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                        <Typography>Tổng số sinh viên đăng ký: {data?.data?.data?.totalItems}</Typography>
                    </Box>}
                    size={"small"}
                    pagination={{
                        current: query?.Page ?? 1,
                        pageSize: query?.PageSize ?? 10,
                        total: data?.data?.data?.totalItems ?? 0
                    }}
                    onChange={(e) => {
                        setQuery(prevState => ({
                            ...prevState,
                            Page: e?.current ?? 1 - 1,
                            PageSize: e?.pageSize
                        }))
                    }}
                    bordered={true}
                    columns={tableColumns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default RegisterState