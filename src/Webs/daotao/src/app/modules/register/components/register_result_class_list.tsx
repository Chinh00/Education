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
            className: "text-[12px]",
        },
        {
            title: 'Tên lớp',
            dataIndex: "courseClassName",
            className: "text-[12px]",
            
        },
        {
            title: 'Tuần bắt đầu học',
            dataIndex: "weekStart",
            className: "text-[12px]",
            width: "5%",
            
        },
        {
            title: 'Số sinh viên dự kiến',
            dataIndex: "numberStudentsExpected",
            className: "text-[12px]",
            width: "5%"
        },
        {
            title: 'Số sinh viên thực tế',
            render: (text, record) => (record?.studentIds?.length ?? 0),
            className: "text-[12px]",
            width: "5%"
        },
        
        
        
        
        {
            className: "text-[12px]",
            title: 'Loại lớp',
            render: (text, record) => (
                <>{record?.courseClassType === 0 ? "Lớp chính" : "Thực hành"}</>
            )
        },
        {
            className: "text-[12px]",
            title: "Giai đoạn học",
            render: (text, record) => (
                <>{getStage[record?.stage]}</>
            )
        },
        {
            className: "text-[12px]",
            title: "Trạng thái",
            render: (text, record) => (
                <>{CourseClassStatus[record?.status]}</>
            )
        },
        
        
        {
            className: "text-[12px]",
            title: 'Giáo viên',
            render: (text, record) => (
                <>
                    <Badge className={`${record?.teacherCode ? "bg-blue-400" : "bg-red-400"}`} >{record?.teacherName ? record?.teacherName : "Chưa xếp giáo viên"}</Badge>
                </>
            )
        },
    ];

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
                <Box className={"flex flex-col gap-16"}>
                    <Typography.Title level={5} className={"text-center"}>Danh sách lớp</Typography.Title>
                    <div className={"relative w-full min-h-[500px]"}>
                        <Table<CourseClass>
                            rowKey={(c) => c.id}
                            
                            loading={courseLoading}
                            className={"absolute top-0 left-0 w-full "}
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
                                columnWidth: "5%"

                            }}
                            pagination={false}
                            columns={columns}
                            virtual
                            scroll={{ x: 1500, y: 900 }}
                            dataSource={courseClass?.data?.data?.items ?? []}

                        />
                    </div>
                    

                    <Tabs defaultActiveKey={"0"} items={items} />
                    
                </Box>
            </Modal>
        </>
    )
}
export default  RegisterResultClassList;