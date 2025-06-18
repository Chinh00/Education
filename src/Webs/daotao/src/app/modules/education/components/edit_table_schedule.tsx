import React, { useState } from 'react';
import {Button, Descriptions, Drawer, Typography} from 'antd';
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import Timeline from "@/app/modules/education/components/timeline.tsx";


export type Edit_table_scheduleProps = {
    subjectCode: string,
    courseClassCode: string
}

const Edit_table_schedule = ({courseClassCode, subjectCode}: Edit_table_scheduleProps) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    const {data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subjectCode
            }
        ]
    }, open && subjectCode !== undefined && subjectCode !== null);
    const getSubject = subjects?.data?.data?.items?.[0];
    const {data: courseClassParent, isLoading} = useGetCourseClasses({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "==",
                value: courseClassCode
            }
        ],
        Includes: ["SessionLengths"]
    }, open && courseClassCode !== undefined && courseClassCode !== null);
    const courseClass = courseClassParent?.data?.data?.items?.[0];
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common)
    return (
        <>
            
            <Button
                icon={<EyeOutlined />}
                size="small"
                variant={"outlined"}
                color={"cyan"}
                style={{ marginLeft: 4 }}
                onClick={showDrawer}
            />
            <Drawer
                title={<div className={"flex justify-between items-center"}>
                    <div>
                        {getSubject?.subjectName} | Lớp <span className={"font-bold text-blue-500"}>{courseClassParent?.data?.data?.items?.[0]?.courseClassName}</span>
                    </div>
                    <div>
                        <Button icon={<DeleteOutlined />} danger />
                    </div>
                </div>}
                loading={isLoading}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                width={"100%"}
            >
                
                <div className={"grid grid-cols-12"}>
                    <Descriptions
                        bordered
                        size={"small"}
                        className={"col-span-4"}
                        column={1}
                        title="Thông tin chi tiết lớp học"
                        labelStyle={{ width: 200, fontWeight: 600 }}
                        contentStyle={{ fontWeight: 400 }}
                    >
                        <Descriptions.Item label="Tên lớp">{courseClass?.courseClassName}</Descriptions.Item>
                        <Descriptions.Item label="Mã lớp">{courseClass?.courseClassCode}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">{courseClass?.status === 1 ? "Đang mở" : "Đã đóng"}</Descriptions.Item>
                        <Descriptions.Item label="Giáo viên">{courseClass?.teacherName || "Chưa có"}</Descriptions.Item>
                        <Descriptions.Item label="Mã giáo viên">{courseClass?.teacherCode || "Chưa có"}</Descriptions.Item>
                        <Descriptions.Item label="Loại lớp">{courseClass?.courseClassType === 1 ? "Chính" : "Phụ"}</Descriptions.Item>
                        <Descriptions.Item label="Số buổi/tuần">{courseClass?.sessionLengths?.join(",")}</Descriptions.Item>
                        <Descriptions.Item label="Tổng số buổi">{courseClass?.totalSession}</Descriptions.Item>
                        <Descriptions.Item label="Số sinh viên hiện tại">{courseClass?.numberStudents}</Descriptions.Item>
                        <Descriptions.Item label="Số sinh viên dự kiến">{courseClass?.numberStudentsExpected}</Descriptions.Item>
                        <Descriptions.Item label="Mã môn học">{courseClass?.subjectCode}</Descriptions.Item>
                        <Descriptions.Item label="Học kỳ">{currentParentSemester?.semesterCode}</Descriptions.Item>
                    </Descriptions>
                    <div
                        className={"col-span-8"}
                    >
                        <Timeline courseClass={courseClass} />
                    </div>    
                </div>
            </Drawer>
        </>
    )
}
export default Edit_table_schedule