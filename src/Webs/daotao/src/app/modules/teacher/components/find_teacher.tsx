import {CourseClass} from "@/domain/course_class.ts";
import {Button, Dropdown, Table, Tooltip, Typography} from "antd";
import {Search, Edit} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useGetTeacherFreeSlotTimeline} from "@/app/modules/teacher/hooks/useGetTeacherFreeSlotTimeline.ts";
import {TeacherFreeSlotTimeline} from "@/app/modules/teacher/services/teacher.service.ts";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Staff} from "@/domain/staff.ts";
import TeacherTimelineModal from "@/app/modules/teacher/components/teacher_timeline_modal.tsx";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import toast from "react-hot-toast";

export type FindTeacherProps = {
    courseClass: CourseClass,
    refresh?: () => void
}

const FindTeacher = ({courseClass, refresh}: FindTeacherProps) => {
    const [open, setOpen] = useState(false)
    
    const [query, setQuery] = useState<TeacherFreeSlotTimeline>({
        // semesterCode: courseClass?.semesterCode!,
        // stage: courseClass?.stage,
        // subjectCode: courseClass?.subjectCode,
        // courseClassCode: courseClass.courseClassCode
        
    })
    useEffect(() => {
        if (courseClass) {
            setQuery(prevState => {
                return {
                    ...prevState,
                    semesterCode: courseClass.semesterCode!,
                    stage: courseClass.stage,
                    subjectCode: courseClass?.subjectCode,
                    courseClassCode: courseClass?.courseClassCode
                }
            });
        }
    }, [courseClass]);
   
    const {data: staffs, isLoading} = useGetTeacherFreeSlotTimeline(query, open && courseClass?.courseClassCode !== undefined)
    const columns: ColumnsType<Staff> = [

        {
            title: 'Tên giảng viên',
            dataIndex: "fullName",
        },
        
        {
            title: 'Mã giảng viên',
            dataIndex: "code",
        },
        {
            title: 'Hành động',
            render: (text, record) => (
                <>
                    <Button loading={isPending} size={"small"}
                    onClick={() => {
                        mutate({
                            courseClassCode: courseClass?.courseClassCode!,
                            teacherCode: record.code,
                        }, {
                            onSuccess: () => {
                                toast.success("Cập nhật giáo viên thành công")
                                reset()
                                setOpen(false)
                                if (refresh) {
                                    refresh()
                                }
                            }
                        })
                    }}
                    >Chấp nhận</Button>
                </>
            )
        },
    ];
    const {mutate, isPending, reset} = useUpdateCourseClassTeacher()
    return (
        <Dropdown
            open={open}
            dropdownRender={() => <div className={" bg-blue-400 space-y-5 p-5 rounded-md min-w-[500px] shadow-xl"}>
                <div className={"flex flex-row gap-2"}>
                    <Button size={"small"} color={"primary"}>Cùng bộ môn</Button>
                </div>
                <div>
                    <Table<Staff>
                        rowKey={(c) => c.id}
                        loading={isLoading}
                        title={() => <Typography.Text strong>Danh sách giáo viên phù hợp</Typography.Text>}
                        style={{maxHeight: "400px"}}

                        size={"small"}
                        bordered={true}
                        pagination={{
                            current: 1,
                            pageSize: 5,
                            total: 5,
                        }}
                        
                        
                        columns={columns}
                        dataSource={staffs?.data?.data?.items ?? []}

                    />
                </div>
            </div>}
            onOpenChange={setOpen}
            placement={"topRight"}
            trigger={["click"]}
        >
            <Tooltip title={courseClass?.teacherCode ? "Thay đổi" : "Tìm kiếm giáo viên"}>
                <Button
                    onClick={() => setOpen(true)}
                    size={"small"}
                    icon={!courseClass?.teacherCode ? <Search size={18} /> : <Edit size={18} />}
                    style={{border: "none"}}
                />
            </Tooltip>
        </Dropdown>
    )
}

export default FindTeacher;