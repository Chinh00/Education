import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {Box, IconButton} from "@mui/material";
import {Input, Select, Table} from "antd";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Subject} from "@/domain/subject.ts";
import React, {useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {ColumnsType, useGetDepartments} from "@/app/modules/common/hook.ts";
import {useNavigate} from "react-router";
import { Checkbox } from "antd";
import {Badge} from "@/app/components/ui/badge.tsx";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import {Settings} from "lucide-react";
import StudySectionCourseClasses from "@/app/modules/education/components/study_section_course_classes.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
const SubjectStudySection = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Cấu hình lớp học cho môn học"}));
    }, []);
    
    const {data: semesters} = useGetSemesters({
        Filters: [
            {
                field: "SemesterStatus",
                operator: "==",
                value: "1"
            },
        ]
    })
    
    
    const {data: subjectsRegister} = useGetSubjectRegister({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesters?.data?.data?.items?.[0]?.semesterCode ?? ""
            }
        ]
    },semesters !== undefined && semesters?.data?.data?.items?.[0]?.semesterCode !== null)
    const getSubjectRegister = (subjectCode: string) => subjectsRegister?.data?.data?.items?.find(e => e.subjectCode === subjectCode) ?? undefined;

    
    
    
    const [query, setQuery] = useState<Query>({})
    const {data: subjects, isLoading: subjectsLoading} = useGetSubjects(query)

    
    
    const columns: ColumnsType<Subject> = [
        {
            title: 'Mã môn học',
            dataIndex: "subjectCode",
        },
        {
            title: 'Tên môn học',
            dataIndex: "subjectName",
            
        },
        {
            title: 'Số tín chỉ',
            dataIndex: "numberOfCredits",
        },
        {
            title: 'Bộ môn',
            render: (_, record) => (
                <span>
                    {departments?.data?.data?.items?.find(e => e.departmentCode === record.departmentCode)?.departmentName} ({record?.departmentCode})</span>
            ),
        },
        {
            title: 'Là môn tính điểm',
            dataIndex: "isCalculateMark",
            render: (text) =>( <Checkbox checked={text} disabled={true} />)
        },
        {
            title: 'Trạng thái',
            render: (text, record) => record?.status === 1 ? 
                <Badge className={"bg-green-600"}>Đang sử dụng</Badge> : <Badge>Không sử dụng</Badge>,
        },
        {
            title: 'Số sinh viên đăng ký nguyện vọng',
            render: (text, record) => getSubjectRegister(record.subjectCode)?.studentCodes?.length ?? 0
        },
        {
            title: 'Hành động',
            key: "action",
            render: (text, record) => (
                // <StudySectionCourseClasses subjectCode={record?.subjectCode}  />
                <IconButton size="small" onClick={() => nav(`/course-class/${record?.subjectCode}/section-config`)}>
                    <Settings size={15} />
                </IconButton>
            )
        },
    ];
    const {data: departments} = useGetDepartments({
        Page: 1,
        PageSize: 100
    }, subjects !== undefined && subjects?.data?.data?.items?.length > 0)
    const nav = useNavigate();
    const [selectedDepartment, setSelectedDepartment] = useState("")
    return (
        <PredataScreen isLoading={false} isSuccess={true} >
            <Box className={"gap-5 grid grid-cols-6"}>
                <Select
                    showSearch
                    className={"col-span-2"}
                    placeholder={"Chọn bộ môn"}
                    onChange={(e) => {
                        setSelectedDepartment(e)
                        setQuery(prevState => ({
                            ...prevState,
                            Filters: [
                                {
                                    field: "DepartmentCode",
                                    operator: "==",
                                    value: e
                                }
                            ],
                            Page: 1
                        }))
                    }}
                >
                    {departments && departments?.data?.data?.items?.map((e) => (
                        <Select.Option key={e.departmentCode} value={e.departmentCode}>
                            {e.departmentName} ({e.departmentCode})
                        </Select.Option>
                    ))}
                </Select>
                <Input.Search
                    placeholder={"Tìm kiếm theo tên môn học"}
                    loading={subjectsLoading} size={"middle"}
                    className={"col-span-1"}                    
                    onSearch={e => {
                    setQuery(prevState => ({
                        ...prevState,
                        Filters: [
                            {
                                field: "SubjectName",
                                operator: "Contains",
                                value: e
                            }
                        ],
                        Page: 1
                    }))
                }} />
                <Table<Subject>
                    rowKey={(c) => c.id}
                    loading={subjectsLoading}
                    className={"col-span-6"}
                    size={"small"}
                    pagination={{
                        current: query?.Page ?? 1,
                        pageSize: query?.PageSize ?? 10,
                        total: subjects?.data?.data?.totalItems ?? 0
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
                    dataSource={
                        subjects?.data?.data?.items ?? []
                    }

                />
            </Box>
        </PredataScreen>
    )
}
export default SubjectStudySection;