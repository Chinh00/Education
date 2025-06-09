import {Link, useNavigate, useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {SubjectRegister} from "@/domain/student_register.ts";
import dayjs from "dayjs";
import {Space, Steps, Table, Typography} from "antd";
import {EyeIcon} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import {Box} from "@mui/material";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import { Badge } from "@/app/components/ui/badge";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";

const RegisterWish = () => {
    const { semester} = useParams()
    const dispatch = useAppDispatch()
    
    
    
    
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Báo cáo đăng ký nguyện vọng học kì ${semester}`}));
    }, []);
    const {data: RegisterState} = useGetRegisters({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            }
        ]
    })
    const getSubject = (subjectCode: string) => {
        return subjects?.data?.data?.items?.filter(e => e.subjectCode === subjectCode)[0] ?? undefined
    }

    const columns: ColumnsType<SubjectRegister> = [
        {
            title: 'Mã môn học',
            dataIndex: "subjectCode",
        },
        {
            title: 'Tên môn học',
            dataIndex: "educationCode",
            render: (text, record) => (
                <span>{getSubject(record?.subjectCode)?.subjectName ?? ""}</span>
            )
        },
        {
            title: 'Số tín chỉ',
            dataIndex: "educationCode",
            render: (text, record) => (
                <span>{getSubject(record?.subjectCode)?.numberOfCredits ?? 0}</span>
            )
        },
        
        {
            title: 'Số lượng sinh viên đăng ký',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{record?.studentCodes?.length}</div>
            )
        }
    ];
    
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
    
    
    
    
    const {data, isPending, isSuccess} = useGetSubjectRegister({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            },
        ]
    }, semester !== undefined)
    const { data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: data?.data?.data?.items?.map(c => c.subjectCode).join(",") ?? ""
            }
        ]
    }, data !== undefined && data?.data?.data?.items?.length > 0)


    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
            <Box className={"flex gap-5 flex-col"}>
                <Table<SubjectRegister>
                    rowKey={(c) => c.id}
                    loading={isPending}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-col space-y-2 p-[16px] text-white "}>
                        <Badge className={"bg-blue-500 text-[15px]"}>Tổng số sinh viên đăng ký: {RegisterState?.data?.data?.items[0]?.numberStudent}</Badge>
                        <Badge className={"bg-yellow-600 text-[15px]"}>Tổng số môn học đăng ký: {RegisterState?.data?.data?.items[0]?.numberSubject}</Badge>
                        <Badge className={"bg-gray-400 text-[15px]"}>Tổng số nguyện vọng: {RegisterState?.data?.data?.items[0]?.numberWish}</Badge>
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
                    columns={columns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default RegisterWish