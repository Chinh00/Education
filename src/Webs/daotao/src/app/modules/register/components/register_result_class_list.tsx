import {Eye, Edit} from "lucide-react";
import {Box, IconButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Button, Modal, Table, Tabs, TabsProps, Tooltip, Typography} from "antd";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import UseGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import {Query} from "@/infrastructure/query.ts";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";
import SubjectTime from "@/app/modules/teacher/components/subject_time.tsx";
import StudentCourseClassEdit from "@/app/modules/register/components/student_course_class_edit.tsx";
import CourseClassDetail from "@/app/modules/register/components/course_class_detail.tsx";

export type RegisterResultClassListProps = {
    semesterCode?: string;
    subjectCode?: string;
}

export const CourseClassStatus: Record<string, any> = {
    0: <Badge className={"bg-cyan-500"}>Hoạt động</Badge>,
    1: <Badge className={"bg-red-500"}>Đã hủy</Badge>,
}

const RegisterResultClassList = ({semesterCode, subjectCode}: RegisterResultClassListProps) => {
    const [openModel, setOpenModel] = useState(false)
    const {data: courseClass, isLoading: courseLoading, refetch: courseClassRefetch} = useGetCourseClasses({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterCode!
            },
            {
                field: "SubjectCode",
                operator: "==",
                value: subjectCode!
            }
        ],
        Includes: ["StudentIds"]
    }, semesterCode !== undefined && subjectCode !== undefined && semesterCode.length > 0 && subjectCode.length > 0 && openModel)

    const columns: ColumnsType<CourseClass> = [

        {
            title: 'Mã lớp',
            dataIndex: "courseClassCode",
        },
        
        {
            title: 'Loại lớp',
            render: (text, record) => (
                <>{record?.courseClassType === 0 ? "Lý thuyết" : "Thực hành"}</>
            )
        },
        {
            title: "Giai đoạn học",
            render: (text, record) => (
                <>{getStage[record?.stage]}</>
            )
        },
        {
            title: "Trạng thái",
            render: (text, record) => (
                <>{CourseClassStatus[record?.status]}</>
            )
        },
        
        
        {
            title: 'Giáo viên',
            render: (text, record) => (
                <>
                    <Badge className={`${record?.teacherCode ? "bg-blue-400" : "bg-red-400"}`} >{record?.teacherName ? record?.teacherName : "Chưa xếp giáo viên"}</Badge>
                </>
            )
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));

    const studentColumns: ColumnsType<Student> = [
        {
            title: 'Tên sinh viên',
            dataIndex: ["personalInformation", "fullName"],
        },
        {
            title: 'Mã sinh viên',
            dataIndex: ["informationBySchool", "studentCode"],
        },
        {
            title: 'Số điện thoại',
            dataIndex: ["personalInformation", "phoneNumber"],
        },
        {
            title: 'Chương trình đào tạo',
            render: (_, record) => (
                <>
                    {record?.educationPrograms?.map((c, index) => {
                        return <Badge key={index} className={"bg-green-500"}>{c?.name}</Badge>
                    })}
                </>
            ),
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <StudentCourseClassEdit refetch={() => {
                    courseClassRefetch();
                    studentRefetch();
                }} studentCode={record?.informationBySchool?.studentCode} courseClassCode={selectedCourseClass?.courseClassCode} />
            )
        },
    ];
    const studentColumn = studentColumns.map((item) => ({ ...item }));

    const [query, setQuery] = useState<Query>({
        Includes: ["InformationBySchool", "PersonalInformation", "EducationPrograms"],
    })
    const {data: students, isLoading: studentsLoading, refetch: studentRefetch} = UseGetStudents(query, query?.Filters?.filter(e => e.field === "InformationBySchool.StudentCode") !== undefined && query?.Filters?.filter(e => e.field === "InformationBySchool.StudentCode")?.length !== 0 && openModel)

    const [selectedCourseClass, setSelectedCourseClass] = useState<CourseClass>()


    const items: TabsProps['items'] = [
        {
            key: '0',
            label: 'Chi tiết lớp học',
            children: <CourseClassDetail onCourseClassCancel={() => {
                courseClassRefetch()
            }} courseClass={selectedCourseClass } />,
        },
        {
            key: '1',
            label: 'Danh sách sinh viên',
            children: <Table<Student>
                rowKey={(c) => c.id}
                loading={studentsLoading}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={" "}>
                    <Typography.Title level={5} className={"text-center"}>Danh sách sinh viên lớp</Typography.Title>
                </Box>}
                size={"small"}


                bordered={true}
                pagination={{
                    current: query?.Page ?? 1,
                    pageSize: query?.PageSize ?? 10,
                    total: students?.data?.data?.totalItems ?? 0
                }}
                onChange={(e) => {
                    setQuery(prevState => ({
                        ...prevState,
                        Page: e?.current ?? 1 - 1,
                        PageSize: e?.pageSize
                    }))
                }}
                columns={studentColumn}
                dataSource={students?.data?.data?.items ?? []}
            />,
        },
        {
            key: '2',
            label: 'Thời khóa biểu',
            children: <SubjectTime semesterCode={semesterCode}  courseClassCode={[selectedCourseClass?.courseClassCode ?? ""]} />,
        },
        
    ];
    return (
        <>
            <Tooltip title={"Chi tiết"}>
                <IconButton size={"small"} onClick={() => {
                    setOpenModel(true)
                }}><Eye size={18} /></IconButton>
            </Tooltip>
            <Modal className={"min-w-[1300px]"} onCancel={() => setOpenModel(false)} open={openModel} onClose={() => setOpenModel(false)}>
                <Box >
                    <Table<CourseClass>
                        rowKey={(c) => c.id}
                        loading={courseLoading}
                        className={""}
                        style={{
                            height: "300px",
                        }}
                        showHeader={true}
                        title={() => <Box className={"text-white "}>
                           <Typography.Title level={5} className={"text-center"}>Danh sách lớp</Typography.Title>
                        </Box>}
                        size={"small"}
                        bordered={true}
                        rowSelection={{
                            type: "radio",
                            onChange: (rowSelection, value) => {
                                setSelectedCourseClass(value[0])
                                if (value[0]?.studentIds?.length > 0) {
                                    setQuery(prevState => ({
                                        ...prevState,
                                        Filters: [
                                            {
                                                field: "InformationBySchool.StudentCode",
                                                operator: "In",
                                                value: value[0]?.studentIds?.join(",") ?? ""
                                            }
                                        ]
                                    }))
                                } else {
                                    setQuery(prevState => ({
                                        ...prevState,
                                        Filters: [
                                            {
                                                field: "InformationBySchool.StudentCode",
                                                operator: "In",
                                                value: ","
                                            }
                                        ]
                                    }))
                                }
                            },

                        }}
                        pagination={false}
                        columns={tableColumns}
                        dataSource={courseClass?.data?.data?.items ?? []}

                    />
                    

                    <Tabs defaultActiveKey={"0"} items={items} />
                    
                </Box>
            </Modal>
        </>
    )
}
export default  RegisterResultClassList;