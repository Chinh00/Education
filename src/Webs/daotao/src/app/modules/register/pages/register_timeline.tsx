import {useNavigate, useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {ColumnsType, useGetSubjects} from "@/app/modules/common/hook.ts";
import {SubjectRegister} from "@/domain/student_register.ts";
import { useGetSubjectRegister } from "../../education/hooks/useGetSubjectRegister";
import { Query } from "@/infrastructure/query";
import {Box, IconButton} from "@mui/material";
import {Table, Typography} from "antd";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Settings} from "lucide-react"
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
const RegisterTimeline = () => {
    const { semester} = useParams()

    const {data, isPending, isSuccess} = useGetSubjectRegister({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            }
        ]
    }, semester !== undefined)
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Các môn học đăng ký mở kì ${semester}`}));
    }, []);
    const { data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: data?.data?.data?.items?.map(c => c.subjectCode).join(",") ?? ""
            }
        ]
    }, data !== undefined && data?.data?.data?.items?.length > 0)
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
        },
        {
            title: 'Cấu hình thời khóa biểu',
            key: "action",
            render: (text, record) => (
                <IconButton size={"small"} onClick={() => {
                    nav(`/register/${semester}/subject/${record?.subjectCode}/course-class`)
                }}><Settings /></IconButton>
            )
        }


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
                    title={() => <Box className={"flex flex-col justify-start items-start p-[16px] text-white "}>
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
export default RegisterTimeline;