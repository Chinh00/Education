import {Avatar, Button, Drawer, Popconfirm, Space, Table, Tag, Tooltip, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {ColumnsType, getStageText} from "@/app/modules/common/hook.ts";
import {Staff} from "@/domain/staff.ts";
import {PlusCircle, Eye, ArrowRight} from "lucide-react";
import {Subject} from "@/domain/subject.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {DeleteOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import Edit_table_schedule from "@/app/modules/education/components/edit_table_schedule.tsx";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {Query} from "@/infrastructure/query.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {Input} from "antd"
import {useGenerateTeacherForCourseClass} from "@/app/modules/teacher/hooks/useGenerateTeacherForCourseClass.ts";
import toast from "react-hot-toast";
export type AssignmentTeacherProps = {
    subject: Subject 
}

const AssignmentTeacher = ({subject}: AssignmentTeacherProps) => {
    const [selectedStaff, setSelectedStaff] = useState<string>()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedStage, setSelectedStage] = useState(0)
    const { currentParentSemester } = useAppSelector<CommonState>(
        (e) => e.common
    );
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject?.subjectCode
            },
            {
                field: "Stage",
                operator: "==",
                value: selectedStage.toString()
            },
            {
                field: "ParentCourseClassCode",
                operator: "==",
                value: ""
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: currentParentSemester?.semesterCode!
            },


        ],
        Sorts: ["CreatedAtDesc"],
    });

    const {data: courseClassesParent, isLoading, refetch: refetchParent} = useGetCourseClasses({...query}, openDrawer && currentParentSemester?.semesterCode !== undefined)
    
    const columns: ColumnsType<CourseClass> = [
        {
            title: "Tên lớp",
            dataIndex: "courseClassName",
            width: "15%",
            className: "text-[12px]",
        },
        {
            title: "Số TC",
            className: "text-[12px]",
            width: "5%",
            render: () => subject?.numberOfCredits,
        },
        {
            title: "Lịch học",
            className: "text-[12px]",
            width: 250,
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
            title: "Thời gian",
            className: "text-[12px]",
            width: 60,
            render: () => (
                <Badge
                    variant={"outline"}
                    className={"bg-blue-100 flex flex-col justify-start items-start"}
                >
                    <span>{getStageText(selectedStage ?? 0)}</span>
                    <span>
                        {DateTimeFormat(currentParentSemester?.startDate, "DD/MM/YYYY")} -{" "}
                        {DateTimeFormat(currentParentSemester?.endDate, "DD/MM/YYYY")}
                    </span>
                </Badge>
            ),
        },
        {
            title: "Số SV dự kiến",
            dataIndex: "numberStudentsExpected",
            className: "text-[12px]",
            width: 40,
        },
        {
            title: "Giảng viên",
            dataIndex: "teacherName",
            className: "text-[12px]",
            width: 50,
            render: (text, record) =>
                record?.teacherName ? (
                    <Space>
                        <Avatar size={22} icon={<UserOutlined />} />
                        {record.teacherName}
                    </Space>
                ) : (
                    <Tag color="orange">Chưa xếp</Tag>
                ),
        },
    ];

    const { data: courseClassesChild, refetch: refetchChild } = useGetCourseClasses(
        {
            Filters: [
                {
                    field: "ParentCourseClassCode",
                    operator: "In",
                    value: courseClassesParent?.data?.data?.items
                        ?.map((e) => e.courseClassCode)
                        ?.join(",")!,
                },
            ],
            Page: 1,
            PageSize: 1000,
        },
        courseClassesParent !== undefined &&
        courseClassesParent?.data?.data?.items?.length > 0
    );
    const { data: timeLines, refetch: timelineRefetch } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: [
                        ...courseClassesParent?.data?.data?.items?.map((c) => c.courseClassCode) ?? [],
                        ...courseClassesChild?.data?.data?.items?.map((c) => c.courseClassCode) ?? [],
                    ]?.join(",")!,
                },
            ],
            Page: 1,
            PageSize: 10000
        },
        courseClassesParent !== undefined &&
        courseClassesParent?.data?.data?.items?.map((c) => c.courseClassCode)?.length > 0 &&
        subject?.subjectCode !== undefined &&
        courseClassesChild !== undefined
    );
    const [rowSelection, setRowSelection] = useState<React.Key[]>([]);
    const getChildRows = (parentCode: string) => {
        return (
            courseClassesChild?.data?.data?.items
                ?.filter((e) => e.parentCourseClassCode === parentCode) ?? []
        );
    };
    const {mutate, isPending} = useGenerateTeacherForCourseClass()
    useEffect(() => {
        setQuery(pre => ({
            ...pre,
            Filters: [
                ...pre?.Filters?.filter(e => e.field !== "Stage") ?? [],
                { field: "Stage", operator: "==", value: `${selectedStage}` },
            ]
        }))
    }, [selectedStage]);
    return (
        <>
            <Tooltip title={"Phân công giảng viên"}>
                <Button onClick={() => setOpenDrawer(true)} icon={<Eye  size={18} />} style={{border: "none"}} />
            </Tooltip>
            <Drawer
            open={openDrawer}
            width={"100%"}
            onClose={() => setOpenDrawer(false)}
            title={`Phân công giảng viên cho môn học: ${subject?.subjectName}`}
            
            >
                <div className={"grid grid-cols-6"}>
                    <div className={"col-span-4"}>
                        <div className={"flex justify-start items-center gap-4"}>
                            <h3 className={"text-lg font-bold"}>Danh sách lớp học</h3>
                            {[0, 1].map((e) => (
                                <Button
                                    key={e}
                                    variant={"filled"}
                                    color={selectedStage === e ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedStage(e);
                                    }}
                                >
                                    Giai đoạn {e + 1}
                                </Button>
                            ))}
                            <Button
                                variant={"filled"}
                                color={selectedStage === 4 ? "primary" : "default"}
                                onClick={() => {
                                    setSelectedStage(4);
                                }}
                            >
                                Cả 2 giai đoạn
                            </Button>
                        </div>
                        <div className={"w-full flex justify-start items-center gap-4 py-2"}>
                            <Button disabled={rowSelection?.length === 0} loading={isPending}
                                onClick={() => {
                                    mutate({
                                        semesterCode: currentParentSemester?.semesterCode!, 
                                        courseClassCodes: rowSelection as string[],
                                        stage: selectedStage,
                                        subjectCode: subject?.subjectCode!
                                    }, {
                                        onSuccess: () => {
                                            refetchParent();
                                            refetchChild();
                                            timelineRefetch();
                                            setRowSelection([]);
                                            toast.success("Xếp giảng viên thành công");
                                        }
                                    })
                                }}
                            >Xếp tự động </Button>
                            <Input.Search />
                            
                            
                        </div>
                        <Table<CourseClass>
                            dataSource={courseClassesParent?.data?.data?.items ?? []}
                            columns={columns}
                            loading={isLoading}
                            rowKey={e => e.courseClassCode}
                            size={"small"}
                            className={"py-5"}
                            bordered={true}
                            pagination={{
                                current: query?.Page ?? 1,
                                pageSize: query?.PageSize ?? 10,
                                total: courseClassesParent?.data?.data?.totalItems ?? 0
                            }}

                            onChange={(e) => {
                                setQuery(prevState => ({
                                    ...prevState,
                                    Page: e?.current ?? 1 - 1,
                                    PageSize: e?.pageSize
                                }))
                            }}
                            expandable={{
                                defaultExpandAllRows: true,
                                columnWidth: "2%",
                                expandedRowRender: (record) => {
                                    const childData = getChildRows(record.courseClassCode);
                                    return (
                                        <Table<CourseClass>
                                            size="small"
                                            rowKey={e => e.courseClassCode}

                                            bordered
                                            columns={columns}

                                            dataSource={childData}
                                            rowClassName="editable-row"
                                            pagination={false}
                                            rowSelection={{
                                                type: "checkbox",
                                                selectedRowKeys: rowSelection,
                                                columnWidth: "2%",
                                                onChange: (selectedRowKeys) => {
                                                    setRowSelection(selectedRowKeys);
                                                },
                                            }}
                                        />
                                    );
                                },
                            }}

                            rowSelection={{
                                type: "checkbox",
                                columnWidth: "2%",
                                selectedRowKeys: rowSelection,
                                onChange: (selectedRowKeys, selectedRows) => {
                                    // Chọn cha thì tự động chọn con (dựa trên courseClassCode)
                                    const allSelectedKeys = new Set(selectedRowKeys as React.Key[]);
                                    courseClassesParent?.data?.data?.items?.forEach((parentRow) => {
                                        const parentKey = parentRow.courseClassCode;
                                        const childKeys = getChildRows(parentRow.courseClassCode).map(c => c.courseClassCode);
                                        if (allSelectedKeys.has(parentKey)) {
                                            childKeys.forEach((k) => allSelectedKeys.add(k));
                                        } else {
                                            childKeys.forEach((k) => allSelectedKeys.delete(k));
                                        }
                                    });
                                    setRowSelection(Array.from(allSelectedKeys));
                                },
                            }}

                        />
                    </div>
                    <div className={'col-span-2'}>
                        Danh sách giảng viên
                    </div>
                </div>
                
            </Drawer>
        </>
    )
}
export default AssignmentTeacher;