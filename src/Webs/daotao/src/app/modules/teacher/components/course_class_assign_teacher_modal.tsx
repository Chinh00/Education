import {Box, IconButton} from "@mui/material";
import {GraduationCapIcon} from "lucide-react";
import {Modal, Table, Tooltip, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {
    CourseClassAssignTeacherState, setCourseClasses, setSelectedRowKeysParents,
     setSelectedRowKeysChildren,
    setSubject
} from "@/app/modules/teacher/stores/course_class_assign_teacher_slice.tsx";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import Table_course_class_timeline_view from "@/app/modules/teacher/components/table_course_class_timeline_view.tsx";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {updateCourseClassTeacher} from "@/app/modules/teacher/services/teacher.service.ts";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import {getStage} from "@/app/modules/register/pages/course_class_list.tsx";


export type CourseClassAssignTeacherModalProps = {
    subjectCode: string
}

const CourseClassAssignTeacherModal = ({subjectCode}: CourseClassAssignTeacherModalProps) => {
    const [openModel, setOpenModel] = useState(false)
    const dispatch = useAppDispatch();
    const { subject, courseClasses, selectedRowKeysChildren, selectedRowKeysParents, teacherAssignments, timelines } = useAppSelector<CourseClassAssignTeacherState>(c => c.courseClassAssignTeacherSliceReducer);
    const courseClassDataSourceParent = Object.values(courseClasses).filter(c => c?.parentCourseClassCode === null);
    const courseClassDataSourceChild = (courseClassParentId: string) => Object.values(courseClasses).filter(c => c?.parentCourseClassCode === courseClassParentId);
    const { data: subjects, isLoading: subjectsLoading } = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subjectCode
            }
        ]
    }, openModel)

    useEffect(() => {
        if (subjects && subjects?.data?.data?.items?.length > 0) {
            dispatch(setSubject(subjects?.data?.data?.items?.[0]));
        } else {
            dispatch(setSubject(undefined));
        }
    }, [subjects]);


    const {data: courseClassParent, isLoading: courseClassParentLoading} = useGetCourseClasses({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subjectCode!
            },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ]
    }, openModel && subject !== undefined)

    useEffect(() => {
        if (courseClassParent && courseClassParent?.data?.data?.items?.length > 0) {
            dispatch(setCourseClasses({
                ...courseClasses,
                ...courseClassParent?.data?.data?.items.reduce((acc, item) => {
                    acc[item.courseClassCode] = item;
                    return acc;
                }, {} as Record<string, CourseClass>)
            }))
        }
    }, [courseClassParent]);
    const {data: courseClassChild, isLoading: courseClassChildLoading} = useGetCourseClasses({
        Filters: [
            {
                field: "ParentCourseClassCode",
                operator: "In",
                value: courseClassParent?.data?.data?.items?.map(item => item.courseClassCode).join(",") || ""
            }
        ]
    }, openModel && subject !== undefined && courseClassParent !== undefined && courseClassParent?.data?.data?.items?.length > 0)
    
    useEffect(() => {
        if (courseClassChild && courseClassChild?.data?.data?.items?.length > 0) {
            dispatch(setCourseClasses({
                ...courseClasses,
                ...courseClassChild?.data?.data?.items.reduce((acc, item) => {
                    acc[item.courseClassCode] = item;
                    return acc;
                }, {} as Record<string, CourseClass>)
            }))
        }
    }, [courseClassChild]);


    useEffect(() => {
        dispatch(setSelectedRowKeysParents(courseClassDataSourceParent?.map(c => c.courseClassCode) || []));
        dispatch(setSelectedRowKeysChildren(Object.values(courseClasses)?.filter(e => e.parentCourseClassCode !== null).map(c => c.courseClassCode) || []));
    }, [courseClasses]);
    
    



    const columns: ColumnsType<CourseClass> = [
        {
            title: 'Mã lớp học',
            dataIndex: "courseClassCode",
        },
        {
            title: 'Tên lớp học',
            dataIndex: "courseClassName",
            render: (_, record) => (
                <Tooltip title={record?.courseClassName}>
                    <Typography.Text className={"text-ellipsis"}> {subject?.subjectName} - {record?.courseClassName} </Typography.Text>
                </Tooltip>
            )
        },
        {
            title: 'Giai đoạn học',
            render: (_, record) => getStage[record?.stage],
        },
        {
            title: 'Số lượng sinh viên',
            dataIndex: "numberStudentsExpected",
        },
        {
            title: 'Tuần bắt đầu',
            dataIndex: "weekStart",
        },
        {
            title: 'STC',
            render: () => subject?.numberOfCredits
        },
        
        {
            title: 'Môn tính điểm',
            dataIndex: "isCalculateMark",
        },
        
    ];
    const {mutate, isPending} = useUpdateCourseClassTeacher()
    return (
        <>
            <Tooltip title={"Danh sách lớp học"}>
                <IconButton size={"small"} onClick={() => setOpenModel(true)}>
                    <GraduationCapIcon size={18} />
                </IconButton>
            </Tooltip>
            <Modal loading={subjectsLoading} open={openModel}
                   okText={"Lưu lại"}
                   onOk={() => {
                          const assignments = Object.entries(teacherAssignments).map(([scheduleId, teacherCode]) => ({
                            courseClassCode: Object.values(timelines)?.find(e => e.id?.includes(scheduleId.split('-')[1]))?.courseClassCode,
                            teacherCode
                          }));
                       Object.entries(assignments).forEach(([courseClassCode, node]) => {
                            mutate({
                                 courseClassCode: node?.courseClassCode as string,
                                 teacherCode: node?.teacherCode ?? ""
                            }, {
                                 onSuccess: () => {
                                      dispatch(setSelectedRowKeysParents([]));
                                      dispatch(setSelectedRowKeysChildren([]));
                                      setOpenModel(false);
                                 }
                            });
                       })
                   }}
                   className={"min-w-[1500px]"}
                   onCancel={() => setOpenModel(false)}>
                    <Box className={"mb-5"}>
                        <Table_course_class_timeline_view />
                    </Box>
                    <Typography.Title level={4} className={"text-center"}>Danh sách lớp học phần</Typography.Title>
                    <Table
                        size={"small"}
                        rowKey={"courseClassCode"}
                        loading={courseClassParentLoading || courseClassChildLoading}
                        bordered={true}
                        pagination={false}
                        columns={columns}
                        dataSource={courseClassDataSourceParent ?? []}
                        rowSelection={{
                            type: "checkbox",
                            columnWidth: "3%",
                            fixed: "left",
                            selectedRowKeys: selectedRowKeysParents,
                            onChange: (selectedKeys, selectedRows) => {
                                // Lấy danh sách các lớp cha được chọn
                                const parents = selectedKeys;

                                // Lấy tất cả các lớp con của các lớp cha đó
                                const allChildren = parents
                                    .map(parentCode => courseClassDataSourceChild(parentCode as string))
                                    .flat()
                                    .map(child => child.courseClassCode);

                                // Set lại: parents và children đều theo các lớp cha được chọn
                                dispatch(setSelectedRowKeysParents(parents));
                                dispatch(setSelectedRowKeysChildren(allChildren));
                            }
                        }}
                        expandable={{
                            defaultExpandAllRows: true,
                            expandedRowRender: (record) => (
                                <Table
                                    size={"small"}
                                    rowKey={"courseClassCode"}
                                    loading={courseClassChildLoading}
                                    bordered={true}
                                    pagination={false}
                                    columns={columns}
                                    dataSource={courseClassDataSourceChild(record.courseClassCode) ?? []}
                                    rowSelection={{
                                        type: "checkbox",
                                        columnWidth: "3%",
                                        fixed: "left",
                                        selectedRowKeys: selectedRowKeysChildren,
                                        onChange: (selectedKeys) => {
                                            dispatch(setSelectedRowKeysChildren(selectedKeys));
                                        },
                                    }}
                                />
                            ),
                        }}
                    />
            </Modal>
        </>
    )
}

export default CourseClassAssignTeacherModal