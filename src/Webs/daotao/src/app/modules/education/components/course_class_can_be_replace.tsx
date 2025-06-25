import UseGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import React, {useEffect, useState} from "react";
import {Button, Modal, Popconfirm, Table, Tooltip, Typography} from "antd";
import {ArrowRight, Edit} from "lucide-react"
import {Box} from "@mui/material";
import useGetStudentSemesters from "@/app/modules/education/hooks/useGetStudentSemesters.ts";
import {useGetCourseClassCanBeReplace} from "@/app/modules/education/hooks/useGetCourseClassCanBeReplace.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {ColumnsType, getStageText} from "@/app/modules/common/hook.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {useChangeCourseClassStudent} from "@/app/modules/education/hooks/useChangeCourseClassStudent.ts";
import toast from "react-hot-toast";

export type Course_class_can_be_replaceProps = {
    studentCode: string;
    courseClassCode: string;
    semesterCode: string;
    stage: number,
    subjectCode?: string;
    open: boolean,
    setOpen: (open: boolean) => void;
}

const Course_class_can_be_replace = ({studentCode, open, setOpen, courseClassCode, semesterCode, stage, subjectCode}: Course_class_can_be_replaceProps) => {
    const {data} = useGetStudentSemesters({
        Filters: [
            {
                field: "StudentCode",
                operator: "==",
                value: studentCode
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterCode
            }
            
        ],
        Includes: ["CourseSubjects"]
    }, open)
    useEffect(() => {
        return () => setOpen(false)
    }, []);
    const studentSemester = data?.data?.data?.items?.[0]
    const {data: courseClassCanBe, isLoading} = useGetCourseClassCanBeReplace({
        currentCourseClassCode: courseClassCode,
        semesterCode: semesterCode ?? "",
        stage: stage,
        subjectCode: subjectCode,
        courseClassCodes: studentSemester?.courseSubjects ?? [],
    }, open )

    const { data: timeLines, refetch: timelineRefetch } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: [
                        ...courseClassCanBe?.data?.data?.items?.map((c) => c.courseClassCode) ?? [],
                    ]?.join(",")!,
                },
            ],
            Page: 1,
            PageSize: 10000
        },
        courseClassCanBe !== undefined 
    );

    const { currentParentSemester, currentChildSemester } = useAppSelector<CommonState>(
        (e) => e.common
    );
    const getSemesterByStage = (stage: number) => currentChildSemester?.find(e => (+e?.semesterCode?.split('_')[3]) === (stage + 1))
    const {mutate, isPending, reset} = useChangeCourseClassStudent()
    const columns: ColumnsType<CourseClass> = [
        {
            title: "Tên lớp học phần",
            dataIndex: "courseClassName",
            key: "courseClassName",
            width: 250
        },
        {
            title: "Lịch học",
            className: "text-[12px]",
            width: 350,
            render: (text, record) => {
                return  <div className={"flex flex-col gap-1 justify-start items-start"}>
                    {timeLines?.data?.data?.items?.filter(e => e?.courseClassCode === record?.courseClassCode)?.map(e => (
                        <div key={e.id} className={"flex flex-row flex-nowrap gap-1"}>
                            <span  className={"font-bold text-gray-500"}>Tuần: {e?.startWeek } {"->"} {e?.endWeek}</span>
                            {e?.dayOfWeek !== -1 ? <span  className={"font-bold text-blue-500"}>Thứ: {e?.dayOfWeek + 2}</span> : "Không xếp được lịch học"}
                            <span  className={"text-green-600"}>Phòng: {e?.roomCode }</span>
                            <span className={"flex flex-row whitespace-nowrap justify-center items-center"}>Tiết: {(+e.slots[0]) + 1}
                                <ArrowRight size={10} />
                                {+e.slots?.[e.slots?.length - 1] + 1}
                            </span>
                        </div>
                    ))}
                </div>
            }

        },
        {
            title: "Loại lớp",
            render: (value, record) => record?.courseClassType === 0 ? "Lớp chính" : "Lớp thành phần",
            
        },
        {
            title: "Giảng viên",
            dataIndex: "teacherName"
            
        },
        
        {
            title: "Thời gian",
            className: "text-[12px]",
            width: 60,
            render: (text, record) => (
                <Badge
                    variant={"outline"}
                    className={"bg-blue-100 flex flex-col justify-start items-start"}
                >
                    <span>{getStageText(stage ?? 0)}</span>
                    <span>
                        {DateTimeFormat(getSemesterByStage(record?.stage)?.startDate, "DD/MM/YYYY")} -{" "}
                        {DateTimeFormat(getSemesterByStage(record?.stage)?.endDate, "DD/MM/YYYY")}
                    </span>
                </Badge>
            ),
        },
        {
            title: "Hành động",
            render: (value, record) => <Popconfirm
                onConfirm={() => {
                    mutate({
                        targetCourseClassCode: record?.courseClassCode ?? "",
                        originalCourseClassCode: courseClassCode,
                        studentCode: studentCode,
                        semesterCode: semesterCode,
                    }, {
                        onSuccess: () => {
                            toast.success("Chuyển lớp học phần thành công");
                            reset()
                            setOpen(false);
                        }
                    })
                }}
                title={"Xác nhận chuyển lớp học phần cho sinh viên"} >
                <Button size={"small"} loading={isPending}
                    
                >Chấp nhận</Button>
            </Popconfirm>
        },
        
    ]
     return (
         <>
            <Tooltip title={"Thay đổi đăng ký học"}>
                <Button style={{border: "none"}} icon={<Edit size={18} />} size={"small"} onClick={() => setOpen(true)} />
            </Tooltip>
             <Modal width={1300} loading={isLoading} onCancel={() => setOpen(false)} onOk={() => setOpen(false)} open={open}>
                 <Box className={"p-5"}>
                     <Typography.Title level={5} >Danh sách lớp học phần thay thế</Typography.Title>
                     <Table<CourseClass> rowKey={"id"} pagination={false} columns={columns} size={"small"} bordered={true} dataSource={courseClassCanBe?.data?.data?.items ?? []} loading={isLoading} />
                 </Box>
             </Modal>
         </>
     )
}

export default Course_class_can_be_replace;