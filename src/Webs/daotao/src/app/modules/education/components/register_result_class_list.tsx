import {Eye, Edit} from "lucide-react";
import {Box, IconButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Button, Drawer, Modal, Popconfirm, Table, Tabs, TabsProps, Tooltip, Typography} from "antd";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {ColumnsType, getStageText} from "@/app/modules/common/hook.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import UseGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import {Query} from "@/infrastructure/query.ts";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";
import SubjectTime from "@/app/modules/teacher/components/subject_time.tsx";
import CourseClassDetail from "@/app/modules/register/components/course_class_detail.tsx";
import StudentCourseClassEdit from "@/app/modules/education/components/student_course_class_edit.tsx";
import {useRemoveStudentFromCourseClass} from "@/app/modules/education/hooks/useRemoveStudentFromCourseClass.ts";
import {Trash} from "lucide-react"
import toast from "react-hot-toast";
import Course_class_can_be_replace from "@/app/modules/education/components/course_class_can_be_replace.tsx";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
export type RegisterResultClassListProps = {
    courseClass: CourseClass
}



const RegisterResultClassList = ({courseClass}: RegisterResultClassListProps) => {
    const [openModel, setOpenModel] = useState(false)
    const {data, isLoading: courseLoading, refetch: courseClassRefetch} = useGetCourseClasses({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "==",
                value: courseClass?.courseClassCode ?? ""
            },
            
        ],
        Includes: ["StudentIds"]
    }, courseClass !== undefined && openModel)
    const {data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: courseClass?.subjectCode ?? ""
            }
        ],
    })
    const [open, setOpen] = useState(false)
    useEffect(() => {
        if (open) {
            courseClassRefetch()
        }
    }, [open]);
    const subject = subjects?.data?.data?.items?.[0];
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
                <div>
                    <Popconfirm okText={"Xác nhận"} cancelText={"Hủy"} title="Huỷ đăng ký học phần sinh viên" onConfirm={() => {
                        mutate({
                            courseClassCode: courseClass?.courseClassCode ?? "",
                            studentCode: record?.informationBySchool?.studentCode ?? ""
                        }, {
                            onSuccess: () => {
                                toast.success("Hủy đăng ký học phần thành công")
                                courseClassRefetch()
                                reset()
                            }
                        })
                    }}>
                        <Tooltip title={"Huỷ đăng ký học phần sinh viên "}><Button size={"small"} style={{border: "none"}} danger icon={<Trash size={18} />} /></Tooltip>
                    </Popconfirm>
                    <Course_class_can_be_replace open={open} setOpen={setOpen} subjectCode={courseClass?.subjectCode} semesterCode={courseClass?.semesterCode!} stage={courseClass?.stage} studentCode={record?.informationBySchool?.studentCode} courseClassCode={courseClass?.courseClassCode ?? ""} />
                </div>
            )
        },
    ];
    const studentColumn = studentColumns.map((item) => ({ ...item }));

    const [query, setQuery] = useState<Query>({
        Includes: ["InformationBySchool", "PersonalInformation", "EducationPrograms"],
    })
    const {data: students, isLoading: studentsLoading, refetch: studentRefetch} = UseGetStudents(query, query?.Filters?.filter(e => e.field === "InformationBySchool.StudentCode") !== undefined && query?.Filters?.filter(e => e.field === "InformationBySchool.StudentCode")?.length !== 0 && openModel)
    useEffect(() => {
        if (data && data.data.data.items[0]?.studentIds?.length > 0) {
            const studentCodes = data.data.data.items[0]?.studentIds ?? [];
            setQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...(prevState.Filters?.filter(e => e.field !== "InformationBySchool.StudentCode") ?? []),
                    {
                        field: "InformationBySchool.StudentCode",
                        operator: "In",
                        value: studentCodes.join(",")
                    }
                ]
            }))
        }
    }, [data]);

    const {mutate, isPending, reset} = useRemoveStudentFromCourseClass()
    
    
    return (
        <>
            <Tooltip title={"Xem danh sách sinh viên lớp"}>
                <IconButton size={"small"} onClick={() => {
                    setOpenModel(true)
                }}><Eye size={18} /></IconButton>
            </Tooltip>
            <Drawer title={<>
                {subject?.subjectName} | <span className={"font-bold text-blue-500"}> {courseClass?.courseClassType === 0 ? "Lớp chính" : "Lớp thành phần"}: {courseClass?.courseClassName}</span> | <span className={"text-red-500"}>{getStageText(courseClass?.stage ?? 0)}</span>
            </>} width={"100%"} open={openModel} onClose={() => setOpenModel(false)}>
                <Box className={"flex flex-col"}>
                    <Typography.Title level={5} className={"text-center"}>Danh sách sinh viên đăng ký</Typography.Title>
                    <Table<Student>
                        rowKey={(c) => c.id}
                        loading={studentsLoading}
                        style={{
                            height: "500px",
                        }}
                        
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
                    />
                 
                    
                </Box>
            </Drawer>
        </>
    )
}
export default  RegisterResultClassList;