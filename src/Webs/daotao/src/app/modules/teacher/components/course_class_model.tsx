import {Box, IconButton} from "@mui/material";

export type CourseClassModelProps = {
    subjectCode: string;
    semesterCode: string;
}
import {GraduationCapIcon, Calendar} from "lucide-react"
import {Button, Modal, Table, Tooltip, Typography} from "antd";
import React, {useState} from "react";
import { CourseClass } from "@/domain/course_class";
import {ColumnsType} from "../../common/hook";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import Subject_time from "@/app/modules/teacher/components/subject_time.tsx";
import AssignmentTeacher from "@/app/modules/teacher/components/assignment_teacher.tsx";
import { Badge } from "@/app/components/ui/badge";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import toast from "react-hot-toast";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";
const CourseClassModel = (props: CourseClassModelProps) => {
    const [openModel, setOpenModel] = useState(false)
    const [courseClassStage, setCourseClassStage] = useState(0)
    const { data: subjects, isLoading } = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: props.subjectCode
            }
        ],
        Includes: ["DepartmentCode", "NumberOfCredits"]
    }, openModel)
    const [courseClassType, setCourseClassType] = useState(0)
    
    const {data: courseClass, isLoading: courseClassLoading, refetch } = useGetCourseClasses({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: subjects?.data?.data?.items?.map(c => c.subjectCode).join(",")!
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: props.semesterCode
            },
            {
                field: "CourseClassType",
                operator: "==",
                value: `${courseClassType}`
            },
            {
                field: "Stage",
                operator: "==",
                value: `${courseClassStage}`
            },
            
            
            
        ]

    }, subjects?.data?.data !== undefined && subjects?.data?.data?.items?.length > 0 && props.semesterCode !== undefined && openModel)
    const [selectedCourseClass, setSelectedCourseClass] = useState<{id: string, courseClassCode: string}>()
    const columns: ColumnsType<CourseClass> = [

        {
            title: 'Mã lớp',
            dataIndex: "courseClassCode",
        },
        // {
        //     title: 'Tên lớp',
        //     dataIndex: "courseClassName",
        // },
        {
            title: 'Loại lớp',
            render: (text, record) => (
                <>{record?.courseClassType === 0 ? "Lý thuyết" : "Thực hành"}</>
            )
        },
        {
            title: 'Giai đoạn',
            render: (text, record) => (
                <>{getStage[record?.stage]}</>
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


    const [teacherCourseClasses, setTeacherCourseClasses] = useState<{teacherCode: string, teacherName: string, teacherCourseClasses: string[]}>({
        teacherCode: "",
        teacherName: "",
        teacherCourseClasses: []
    })
    const {mutate, isPending } = useUpdateCourseClassTeacher()

    return (
        <>
            <Tooltip title={"Danh sách lớp học"}>
                <IconButton size={"small"} onClick={() => setOpenModel(true)}>
                    <GraduationCapIcon />
                </IconButton>
            </Tooltip>
            <Modal
                loading={isLoading}
                okButtonProps={{
                    loading: isPending,
                }}
                className={"min-w-[1500px] "}
                onOk={() => {
                    mutate({
                        courseClassCode: courseClass?.data?.data?.items?.filter(e => e.courseClassCode === selectedCourseClass?.courseClassCode)[0]?.courseClassCode ?? "",
                        teacherCode: teacherCourseClasses.teacherCode,
                    }, {
                        onSuccess: () => {
                            toast.success("Đã xếp thành công giáo viên cho lớp học")
                            refetch()
                        }
                    })
                }}
                open={openModel} onCancel={() => setOpenModel(false)} onClose={() => setOpenModel(false)}>
                <div className={"grid grid-cols-6 gap-5"}>
                    <Typography.Title level={4} className={"text-center col-span-6"}>Danh sách các lớp phần học môn: {subjects?.data?.data?.items[0]?.subjectName}</Typography.Title>
                    <div className={"col-span-4 space-y-5"}>
                        <Table<CourseClass>
                            rowKey={(c) => c.id}
                            loading={courseClassLoading}
                            className={""}
                            style={{
                                height: "300px",
                            }}
                            showHeader={true}
                            title={() => <Box className={"flex flex-col justify-start gap-5 items-start p-[16px] text-white "}>
                                <div className={"flex flex-row justify-start gap-5 items-center"}>
                                    <Button
                                        onClick={() => setCourseClassStage(0)}
                                        size={"small"} type={courseClassStage === 0 ? "primary" : "dashed"}>Giai đoạn 1</Button>
                                    <Button
                                        onClick={() => setCourseClassStage(1)}
                                        size={"small"} type={courseClassStage === 1 ? "primary" : "dashed"}>Giai đoạn 2</Button>
                                    <Button
                                        onClick={() => setCourseClassStage(2)}
                                        size={"small"} type={courseClassStage === 2 ? "primary" : "dashed"}>Cả 2 giai đoạn</Button>
                                    
                                </div>
                                <div className={"flex flex-row justify-start gap-5 items-center"}>
                                    <Button
                                        onClick={() => setCourseClassType(0)}
                                        size={"small"} type={courseClassType === 0 ? "primary" : "dashed"}>Lý thuyết</Button>
                                    <Button
                                        onClick={() => setCourseClassType(1)}
                                        size={"small"} type={courseClassType === 1 ? "primary" : "dashed"}>Thực hành</Button>
                                </div>
                            </Box>}
                            size={"small"}
                            bordered={true}
                            rowSelection={{
                                type: "radio",
                                onChange: (rowSelection, value) => {
                                    setSelectedCourseClass(prevState => ({
                                        ...prevState,
                                        id: value[0]?.id,
                                        courseClassCode: value[0]?.courseClassCode,
                                    }))
                                },

                            }}
                            pagination={false}
                            columns={tableColumns}
                            dataSource={courseClass?.data?.data?.items ?? []}

                        />
                        <div className={"flex flex-col space-y-2"}>
                            {selectedCourseClass?.courseClassCode && <Badge className={"bg-emerald-600 text-[15px]"}>Đang chọn lớp: {selectedCourseClass?.courseClassCode}</Badge>}
                            {teacherCourseClasses?.teacherCode && <Badge className={"bg-blue-600 text-[15px]"}>Đang chọn giảng viên: {teacherCourseClasses?.teacherName} ({teacherCourseClasses?.teacherCode})</Badge>}
                        </div>
                        <Subject_time courseClassCode={[selectedCourseClass?.courseClassCode ?? ""]} teacherCourseClassCode={teacherCourseClasses?.teacherCourseClasses} />

                    </div>
                    
                    <div className={"col-span-2 max-h-[800px]"}>
                        <AssignmentTeacher
                            courseClassStage={courseClassStage ?? 0}
                            courseClass={courseClass?.data?.data?.items?.filter(e => e.courseClassCode === selectedCourseClass?.courseClassCode)[0]}
                            departmentCode={subjects?.data?.data?.items[0]?.departmentCode}
                            onClick={function (selectedTeacher: string, teacherName: string, list: string[]): void {
                                setTeacherCourseClasses(prevState => ({
                                    ...prevState,
                                    teacherCode: selectedTeacher,
                                    teacherName: teacherName,
                                    teacherCourseClasses: list
                                }))
                            }}                              />                         
                    </div>
                    
                </div>
            </Modal>
        </>
    )
}
export default CourseClassModel;