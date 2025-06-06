import {Table, Typography} from "antd";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {SubjectRegister} from "@/domain/student_register.ts";
import {Box, IconButton} from "@mui/material";
import {Eye} from "lucide-react";
import { useState } from "react";
import { Query } from "@/infrastructure/query";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useNavigate} from "react-router";
import RegisterResultClassList from "@/app/modules/register/components/register_result_class_list.tsx";
import { Badge } from "@/app/components/ui/badge";

export type RegisterResultProps = {
    semesterCode?: string;
}

const RegisterResult = ({semesterCode}: RegisterResultProps) => {
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterCode!
            }
        ]
    })
    const {data, isPending, isSuccess} = useGetSubjectRegister(query, semesterCode !== undefined)
    const nav = useNavigate();

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
    
    const {data: courseClasses} = useGetCourseClasses({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterCode!
            },
            {
                field: "SubjectCode",
                operator: "In",
                value: data?.data?.data?.items?.map(c => c.subjectCode).join(",") ?? ""
            }
        ],
        Includes: ["StudentIds"]
    }, semesterCode !== undefined && data !== undefined && data?.data?.data?.items?.length > 0)
    
    const getCourseClass = (subjectCode: string) => {
        return courseClasses?.data?.data?.items?.filter(e => e.subjectCode === subjectCode) ?? []
    }
    
    const columns: ColumnsType<SubjectRegister> = [
        {
            title: 'Mã môn học',
            dataIndex: "subjectCode",
            fixed: "left",
            width: 100
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
            title: 'Số lượng sinh viên đăng ký nguyện vọng',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{record?.studentCodes?.length}</div>
            )
        },
        {
            title: 'Số lớp đã mở',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div className={"space-x-2 flex-col"}>
                    <Badge className={"bg-blue-500"}>Hoạt động {getCourseClass(record?.subjectCode)?.filter(e => e.status === 0)?.length}</Badge>
                    <Badge className={"bg-red-500"}>Đã hủy {getCourseClass(record?.subjectCode)?.filter(e => e.status === 1)?.length}</Badge>
                </div>
            )
        },
        {
            title: 'Tổng số sinh viên đã đăng ký',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{getCourseClass(record?.subjectCode).reduce((acc, currentValue) => {
                    return acc + (currentValue?.studentIds?.length ?? 0);
                }, 0)}</div>
            )
        },
        
        
        {
            title: 'Hành động',
            key: "action",
            render: (text, record) => (
                <RegisterResultClassList semesterCode={semesterCode} subjectCode={record?.subjectCode} />
            ),
            fixed: "right",
            width: 100
        }


    ];
    const tableColumns = columns.map((item) => ({ ...item }));
    return (
        <>
            <Typography.Title level={4} className={"text-center"}>Kết quả đăng ký học kì: {semesterCode}</Typography.Title>
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
                scroll={{ x: 1500 }}
                bordered={true}
                columns={tableColumns}
                dataSource={data?.data?.data?.items ?? []}
            />
        </>
    )
}
export default RegisterResult;