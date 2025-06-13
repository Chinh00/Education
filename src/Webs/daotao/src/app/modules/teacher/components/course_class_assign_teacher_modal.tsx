import {Box, IconButton} from "@mui/material";
import {GraduationCapIcon} from "lucide-react";
import {Modal, Table, Tooltip} from "antd";
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


export type CourseClassAssignTeacherModalProps = {
    subjectCode: string
}

const CourseClassAssignTeacherModal = ({subjectCode}: CourseClassAssignTeacherModalProps) => {
    const [openModel, setOpenModel] = useState(false)
    const dispatch = useAppDispatch();
    const { subject, courseClasses, selectedRowKeysChildren, selectedRowKeysParents } = useAppSelector<CourseClassAssignTeacherState>(c => c.courseClassAssignTeacherSliceReducer);
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
    })

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
            title: 'Tên lớp học',
            dataIndex: "courseClassCode",
        },
        {
            title: 'STC',
            render: () => subject?.numberOfCredits
        },
        
        {
            title: 'Môn tính điểm',
            dataIndex: "isCalculateMark",
        },
        {
            title: 'Tình trạng',
            render: (text, record) => (
                <>
                    <CourseClassAssignTeacherModal subjectCode={record.subjectCode} />
                </>
            )
        },
    ];
    
    return (
        <>
            <Tooltip title={"Danh sách lớp học"}>
                <IconButton size={"small"} onClick={() => setOpenModel(true)}>
                    <GraduationCapIcon size={18} />
                </IconButton>
            </Tooltip>
            <Modal loading={subjectsLoading} open={openModel}
                   className={"min-w-[1500px]"}
                   onCancel={() => setOpenModel(false)}>
                    <Box className={""}>
                        <Table_course_class_timeline_view />
                    </Box>
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
                            onChange: (selectedKeys) => {
                                dispatch(setSelectedRowKeysParents(selectedKeys));
                            },
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