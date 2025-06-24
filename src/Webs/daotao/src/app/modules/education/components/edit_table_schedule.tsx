import React, { useState } from 'react';
import { Button, Descriptions, Drawer } from 'antd';
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useGetCourseClasses } from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import { useGetSubjects } from "@/app/modules/subject/hooks/hook.ts";
import { useAppSelector } from "@/app/stores/hook.ts";
import { CommonState } from "@/app/stores/common_slice.ts";
import Timeline from "@/app/modules/education/components/timeline.tsx";
import { CourseClass } from "@/domain/course_class.ts";
import { Badge } from "@/app/components/ui/badge.tsx";
import { useUpdateCourseClassStatus } from "@/app/modules/education/hooks/useUpdateCourseClassStatus.ts";
import toast from "react-hot-toast";

export type Edit_table_scheduleProps = {
    subjectCode: string,
    courseClass: CourseClass,
    listCourseClassesRelative?: string[]
}

const Edit_table_schedule = ({ courseClass, subjectCode, listCourseClassesRelative }: Edit_table_scheduleProps) => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    // Query dữ liệu môn học
    const { data: subjects } = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subjectCode
            }
        ]
    }, open && !!subjectCode);
    const getSubject = subjects?.data?.data?.items?.[0];

    // Query dữ liệu lớp học phần (dùng cho thông tin cập nhật mới nhất)
    const { data: courseClassParent, isLoading, refetch } = useGetCourseClasses({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "==",
                value: courseClass?.courseClassCode
            }
        ],
        Includes: ["SessionLengths"]
    }, open && !!courseClass?.courseClassCode);

    const { currentParentSemester } = useAppSelector<CommonState>(e => e.common)
    const { mutate, isPending } = useUpdateCourseClassStatus();

    // Ưu tiên lấy data mới nhất từ query, fallback về prop truyền vào
    const cc = courseClassParent?.data?.data?.items?.[0] ?? courseClass;

    return (
        <>
            <Button
                icon={<EyeOutlined />}
                size="small"
                type="default"
                style={{ marginLeft: 4 }}
                onClick={showDrawer}
            />
            <Drawer
                title={
                    <div className="flex justify-between items-center">
                        <div>
                            {getSubject?.subjectName} | Lớp <span className="font-bold text-blue-500">{cc?.courseClassName}</span>
                        </div>
                        <div>
                            <Button icon={<DeleteOutlined />} danger />
                        </div>
                    </div>
                }
                loading={isLoading}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                width={"100%"}
            >
                <div className="grid grid-cols-12">
                    <div className="col-span-4 flex flex-col gap-5 items-end">
                        <Descriptions
                            bordered
                            size="small"
                            className="w-full"
                            column={1}
                            title="Thông tin chi tiết lớp học"
                            styles={{
                                label: { width: 200, fontWeight: 600 },
                                content: { fontWeight: 400 }
                            }}
                        >
                            <Descriptions.Item label="Tên lớp">{cc?.courseClassName}</Descriptions.Item>
                            <Descriptions.Item label="Mã lớp">{cc?.courseClassCode}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">{cc?.status === 0 ? <Badge className="bg-green-600">Đang mở</Badge> : <Badge>Đã hủy</Badge>}</Descriptions.Item>
                            <Descriptions.Item label="Giáo viên">{cc?.teacherName || "Chưa có"}</Descriptions.Item>
                            <Descriptions.Item label="Mã giáo viên">{cc?.teacherCode || "Chưa có"}</Descriptions.Item>
                            <Descriptions.Item label="Loại lớp">{cc?.courseClassType === 1 ? "Chính" : "Phụ"}</Descriptions.Item>
                            {cc?.sessionLengths && (
                                <Descriptions.Item label="Số buổi/tuần">{Array.isArray(cc?.sessionLengths) ? cc.sessionLengths.join(", ") : cc.sessionLengths}</Descriptions.Item>
                            )}
                            <Descriptions.Item label="Tổng số buổi">{cc?.totalSession}</Descriptions.Item>
                            <Descriptions.Item label="Số sinh viên dự kiến">{cc?.numberStudentsExpected}</Descriptions.Item>
                            <Descriptions.Item label="Mã môn học">{cc?.subjectCode}</Descriptions.Item>
                            <Descriptions.Item label="Học kỳ">{currentParentSemester?.semesterCode}</Descriptions.Item>
                        </Descriptions>
                        <Button
                            danger
                            className="float-right w-min"
                            type="default"
                            variant="outlined"
                            disabled={cc?.status === 1}
                            loading={isPending}
                            onClick={() => {
                                mutate({
                                    courseClassCode: cc?.courseClassCode,
                                    status: 1
                                }, {
                                    onSuccess: () => {
                                        toast.success("Đã hủy lớp học phần thành công");
                                        refetch();
                                    }
                                })
                            }}
                        >
                            Hủy lớp học phần
                        </Button>
                    </div>
                    <div className="col-span-8">
                        <Timeline courseClass={cc} listCourseClassesRelative={listCourseClassesRelative} />
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default Edit_table_schedule;