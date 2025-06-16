import {CircleX, Plus, Settings, ArrowRight} from "lucide-react";
import {Box, IconButton} from "@mui/material";
import {Avatar, Button, Card, Empty, Form, Modal, Space, Table, Tag, Tooltip, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {CourseClass} from "@/domain/course_class.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {Query} from "@/infrastructure/query.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {ColumnsType, getStageText, useGetRooms} from "@/app/modules/common/hook.ts";
import TableSchedule from "@/app/modules/education/components/table_schedule.tsx";
import {BookOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {
    setCourseClasses,
    setCourseClassesTimelines,
    setCurrentStageConfig, setSelectedRowKeysChildren, setSelectedRowKeysParents,
    setSubject,
    SubjectStudySectionState
} from "@/app/modules/education/stores/subject_study_section.ts";
import EditableCell from "@/app/modules/education/components/edit_cell.tsx";
import {Badge} from "@/app/components/ui/badge";
import {useCreateCourseClass} from "@/app/modules/education/hooks/useCreateCourseClass.ts";
import {CourseClassModel, SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import toast from "react-hot-toast";
import {CommonState} from "@/app/stores/common_slice.ts";


export type StudySectionCourseClassesProps = {
    subjectCode: string
}
const StudySectionCourseClasses = ({subjectCode}: StudySectionCourseClassesProps) => {
    const {
        currentStageConfig, 
        timelines, 
        subject,
        courseClasses, 
        courseClassesTimelines,
        selectedRowKeysChildren,
        selectedRowKeysParents
    } = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);
    const courseClassDataSourceParent = Object.values(courseClasses).filter(c => c?.parentCourseClassCode === null);
    const courseClassDataSourceChild = (courseClassParentId: string) => Object.values(courseClasses).filter(c => c?.parentCourseClassCode === courseClassParentId);
    const { data: rooms } = useGetRooms({ Page: 1, PageSize: 1000 });
    
    const dispatch = useAppDispatch()
    const [openModal, setOpenModal] = useState(false);
    const {currentParentSemester, currentChildSemester} = useAppSelector<CommonState>(e => e.common);

    
    
    const { data: subjects } = useGetSubjects(
        { Filters: [{ field: "SubjectCode", operator: "==", value: subjectCode! }] },
        subjectCode !== undefined && openModal && subjectCode !== ""
    );
    const getSubject = subjects?.data?.data?.items?.[0];

    useEffect(() => {
        if (subjects) {
            dispatch(setSubject(getSubject));
        }
    }, [subjects]);

    
    

    const [query, setQuery] = useState<Query>({
        Filters: [
            { field: "SubjectCode", operator: "==", value: subjectCode! },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
    });

    // Lấy danh sách lớp cha
    const { data: courseClassesParent, isLoading } = useGetCourseClasses(
        query,
        subjectCode !== undefined && openModal && subjectCode !== ""
    );

    useEffect(() => {
        if (courseClassesParent?.data?.data?.items?.length === 0) {
            dispatch(setCourseClasses({}));
            dispatch(setSelectedRowKeysParents([]));
            dispatch(setSelectedRowKeysChildren([]));
        }
    }, [courseClassesParent]);
    
    
    
    // Thay đổi giai đoạn học
    useEffect(() => {
        if (currentStageConfig !== null) {
            setQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(e => e?.field !== "Stage") ?? [],
                    { field: "Stage", operator: "==", value: `${currentStageConfig}` },
                ],
            }))
        }
    }, [currentStageConfig]);
    
    

    // Lấy danh sách lớp học thành phần
    const { data: courseClassesChild } = useGetCourseClasses({
        Filters: [
            { field: "ParentCourseClassCode", operator: "In", value: courseClassesParent?.data?.data?.items?.map(e => e.courseClassCode)?.join(",")! },
            { field: "Stage", operator: "==", value: `${currentStageConfig}` },
        ],
    }, courseClassesParent !== undefined && courseClassesParent?.data?.data?.items?.length > 0 && openModal);
    useEffect(() => {
        if (courseClassesChild?.data?.data?.items?.length === 0) {
            dispatch(setCourseClasses({}));
            dispatch(setSelectedRowKeysParents([]));
            dispatch(setSelectedRowKeysChildren([]));
        }
    }, [courseClassesChild]);
    
    
    // Lấy thời khóa biểu của các lớp học
    const { data: timeLines } = useGetTimeline(
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
        },
        courseClassesParent !== undefined &&
        courseClassesParent?.data?.data?.items?.map((c) => c.courseClassCode)?.length > 0 &&
        openModal &&
        subjectCode !== undefined && 
        courseClassesChild !== undefined
    );
    

    
    

    
    
    const [editingKeys, setEditingKeys] = useState<string[]>([])
    
    const isEditing = (record: CourseClass) => editingKeys.includes(record.id as string);

    

    const handleAddParentRow = () => {
        const newRow = {
            id: `courseClassParent_${Date.now()}`,
            courseClassName: "",
            teacherName: "",
            stage: currentStageConfig,
            parentCourseClassCode: null,
        } as unknown as CourseClass;
        
        dispatch(setCourseClasses({
            ...courseClasses,
            [newRow.id]: newRow
        }))
        dispatch(setSelectedRowKeysParents([newRow.id, ...selectedRowKeysParents]));
        setEditingKeys(prevState => [...prevState, newRow.id as string]);
    };
    
    const handleAddChildRow = (courseClassParentId: string) => {
        const newRow = {
            id: `courseClassChild_${Date.now()}`,
            courseClassName: "",
            teacherName: "",
            stage: currentStageConfig,
            parentCourseClassCode: courseClassParentId,
        } as unknown as CourseClass;
        
        dispatch(setCourseClasses({
            ...courseClasses,
            [newRow.id]: newRow
        }))
        dispatch(setSelectedRowKeysChildren([newRow.id, ...selectedRowKeysChildren]));
        setEditingKeys(prevState => [...prevState, newRow.id as string]);
    };
    
    

    useEffect(() => {
        dispatch(setCourseClasses({
            ...courseClasses,
            ...courseClassesParent?.data?.data?.items?.reduce(
                (acc, cur) => {
                    acc[cur.courseClassCode] = cur;
                    return acc;
                },
                {} as Record<string, CourseClass>
            ),
        }))
        
    }, [courseClassesParent]);

    useEffect(() => {
        if (courseClassesParent === undefined) {
            dispatch(setCourseClasses({}));
            dispatch(setSelectedRowKeysParents([]));
            dispatch(setSelectedRowKeysChildren([]));
        }
    }, [courseClassesParent]);
    
    useEffect(() => {
        dispatch(setCourseClasses({
            ...courseClasses,
            ...courseClassesChild?.data?.data?.items?.reduce(
                (acc, cur) => {
                    acc[cur.courseClassCode] = cur;
                    return acc;
                },
                {} as Record<string, CourseClass>
            ),
        
        }))
    }, [courseClassesChild]);


    const columns: ColumnsType<CourseClass> = [
        {
            title: "Tên lớp",
            dataIndex: "courseClassName",
            width: "15%",
            className: "text-[12px]",
            onCell: (record) => ({
                record,
                editing: isEditing(record),
                dataIndex: record.id,
                title: "Tên lớp",
                inputType: "text",
                children: <span className="font-bold">{record?.courseClassName ||
                    <span className="text-gray-400">[Chưa đặt tên]</span>}</span>,
                placeholder: "Nhập tên lớp học"
            }),
            
        },
        {
            title: "Số TC",
            className: "text-[12px]",
            width: "5%",
            render: (text, record) => getSubject?.numberOfCredits
                
        },
        {
            title: "Lịch học",
            className: "text-[12px]",
            width: 60,
            render: (text, record) => {
                return  <div className={"flex flex-col gap-1 justify-start items-start"}>
                    {timeLines?.data?.data?.items?.filter(e => e?.courseClassCode === record?.courseClassCode)?.map(e => (
                        <div key={e.id} className={"flex flex-row flex-nowrap gap-1"}>
                            <span  className={"font-bold text-blue-500"}>Thứ: {e?.dayOfWeek + 2}</span>
                            <span  className={"text-green-600"}>Phòng: {e?.roomCode }</span>
                            <span className={"flex flex-row whitespace-nowrap justify-center items-center"}>Tiết: {(+e.slots[0]) + 1}
                                <ArrowRight size={10} />
                                {+e.slots?.[e.slots?.length - 1] + 1}
                            </span>
                        </div>
                    ))}
                    {courseClassesTimelines[record.id]?.map(e => timelines[e])?.map(e => {
                        return (
                            <div key={e?.id} className={"flex flex-row flex-nowrap gap-1"}>
                                <span  className={"font-bold text-blue-500"}>Thứ: {e?.dayOfWeek + 2}</span>
                                <span  className={"text-green-600"}>Phòng: {e?.roomCode}</span>
                                <span  className={"flex flex-row whitespace-nowrap justify-center items-center"}>Tiết: {e?.slots[0] + 1}
                                    <ArrowRight size={10} />
                                    {e.slots?.[e.slots?.length - 1] + 1}
                            </span>
                            </div>
                        )
                    })}
                </div>
            }
            
        },
        {
            title: "Thời gian",
            className: "text-[12px]",
            width: 60,
            render: (text, record) => {
                return <Badge variant={"outline"} className={"bg-blue-100 flex flex-col justify-start items-start"} >
                    <span>{getStageText(currentStageConfig ?? 0)}</span>
                    <span>{DateTimeFormat(currentParentSemester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(currentParentSemester?.endDate, "DD/MM/YYYY")}</span>
                </Badge>
            }

        },
        {
            title: "Tuần bắt đầu",
            className: "text-[12px]",
            dataIndex: "weekStart",
            width: "15%",
            onCell: (record) => ({
                record,
                editing: isEditing(record),
                dataIndex: record.id,
                title: "Tuần bắt đầu",
                inputType: "weeknumber",
                placeholder: "Tuần bắt đầu",
                children: <Space>
                    <Avatar size={22} icon={<UserOutlined />} />
                    Tuần thứ: {record?.weekStart ?? "[Chưa nhập]"} 
                </Space>,
            }),

        },
        {
            title: "Số SV dự kiến",
            dataIndex: "numberStudentsExpected",
            className: "text-[12px]",
            width: 40,
            onCell: (record) => ({
                record,
                editing: isEditing(record),
                dataIndex: record.id,
                title: "Số SV dự kiến",
                inputType: "number",
                placeholder: "Số SV dự kiến",
                children: <Space>
                    <Avatar size={22} icon={<UserOutlined />} />
                    {record?.numberStudentsExpected ?? "[Chưa nhập]"} (SV)
                </Space>,
            }),
        },
        {
            title: "Giảng viên",
            dataIndex: "teacherName",
            className: "text-[12px]",
            width: 50,
            render: (text, record) =>
                record?.teacherName
                    ? (
                        <Space>
                            <Avatar size={22} icon={<UserOutlined />} />
                            {record.teacherName}
                        </Space>
                    )
                    : <Tag color="orange">Chưa xếp</Tag>
        },
        {
            title: <span className={"text-[12px]"}>Thao tác</span>,
            dataIndex: "operation",
            width: "5%",
            fixed: "right",
            align: "center" as const,
            render: (_, record) => {
                const editable = isEditing(record);
                return <Tooltip title={"Xóa"}>
                    <Button disabled={!record?.id?.startsWith("courseClass")} type="link" size="small" onClick={() => {
                        setEditingKeys(prevState => prevState.filter(key => key !== record.id));
                        const {[record?.id as string]: _, ...rest} = courseClasses
                        dispatch(setCourseClasses({
                            ...rest,
                        }))
                    }}>
                        <CircleX size={18} color={"red"} />
                    </Button>
                </Tooltip>;
            },
        },
    ];

    const childColumns: ColumnsType<CourseClass> = [
        {
            title: "Các lớp thành phần",
            dataIndex: "courseClassName",
            width: "15%",
            className: "text-[12px]",
            onCell: (record) => ({
                record,
                editing: isEditing(record),
                dataIndex: record.id,
                title: "Tên lớp",
                inputType: "text",
                children: <span className="font-bold">{record?.courseClassName ||
                    <span className="text-gray-400">[Chưa đặt tên]</span>}</span>,
                placeholder: "Nhập tên lớp học"
            }),

        },
        {
            title: "Số TC",
            className: "text-[12px]",
            width: "5%",
            render: (text, record) => getSubject?.numberOfCredits

        },
        {
            title: "Lịch học",
            className: "text-[12px]",
            width: 60,
            render: (text, record) => {
                return  <div className={"flex flex-col gap-1 justify-start items-center"}>
                    {timeLines?.data?.data?.items?.filter(e => e?.courseClassCode === record?.courseClassCode)?.map(e => (
                        <div key={e.id} className={"flex flex-row flex-nowrap gap-1"}>
                            <span  className={"font-bold text-blue-500"}>Thứ: {e.dayOfWeek + 2}</span>
                            <span  className={"text-green-600"}>Phòng: {e.roomCode + 2}</span>
                            <span className={"flex flex-row whitespace-nowrap justify-center items-center"}>Tiết: {(+e.slots[0]) + 1}
                                <ArrowRight size={10} />
                                {+e.slots?.[e.slots?.length - 1] + 1}
                            </span>
                        </div>
                    ))}
                    {courseClassesTimelines[record.id]?.map(e => (
                        <div key={e} className={"flex flex-row flex-nowrap gap-1"}>
                            <span  className={"font-bold text-blue-500"}>Thứ: {timelines[e]?.dayOfWeek + 2}</span>
                            <span  className={"text-green-600"}>Phòng: {timelines[e]?.roomCode + 2}</span>
                            <span className={"flex flex-row whitespace-nowrap justify-center items-center"}>Tiết: {timelines[e]?.slots[0] + 1}
                                <ArrowRight size={10} />
                                {timelines[e]?.slots?.[timelines[e]?.slots?.length - 1] + 1}
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
            render: (text, record) => {
                return <Badge variant={"outline"} className={"bg-blue-100 flex flex-col justify-start items-start"} >
                    <span>{getStageText(currentStageConfig ?? 0)}</span>
                    <span>{DateTimeFormat(currentParentSemester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(currentParentSemester?.endDate, "DD/MM/YYYY")}</span>
                </Badge>
            }

        },
        {
            title: "Tuần bắt đầu",
            className: "text-[12px]",
            dataIndex: "weekStart",
            width: "15%",
            onCell: (record) => ({
                record,
                editing: isEditing(record),
                dataIndex: record.id,
                title: "Tuần bắt đầu",
                inputType: "weeknumber",
                placeholder: "Tuần bắt đầu",
                children: <Space>
                    <Avatar size={22} icon={<UserOutlined />} />
                    Tuần thứ: {record?.weekStart ?? "[Chưa nhập]"}
                </Space>,
            }),

        },
        {
            title: "Số SV dự kiến",
            dataIndex: "numberStudentsExpected",
            className: "text-[12px]",
            width: 40,
            onCell: (record) => ({
                record,
                editing: isEditing(record),                
                dataIndex: record.id,
                title: "Số SV dự kiến",
                inputType: "number",
                placeholder: "Số SV dự kiến",
                children: <Space>
                    <Avatar size={22} icon={<UserOutlined />} />
                    {record?.numberStudentsExpected ?? "[Chưa nhập]"} (SV)
                </Space>,
            }),
        },
        {
            title: "Giảng viên",
            dataIndex: "teacherName",
            className: "text-[12px]",
            width: 50,
            render: (text, record) =>
                record?.teacherName
                    ? (
                        <Space>
                            <Avatar size={22} icon={<UserOutlined />} />
                            {record.teacherName}
                        </Space>
                    )
                    : <Tag color="orange">Chưa xếp</Tag>
        },
        {
            title: <span className={"text-[12px]"}>Thao tác</span>,
            dataIndex: "operation",
            width: 20,
            fixed: "right",
            align: "center" as const,
            render: (_, record) => {
                const editable = isEditing(record);
                return <Tooltip title={"Xóa"}>
                    <Button type="link" size="small" onClick={() => {
                        setEditingKeys(prevState => prevState.filter(key => key !== record.id));
                        const {[record?.id as string]: _, ...rest} = courseClasses
                        dispatch(setCourseClasses({
                            ...rest,
                        }))
                    }}>
                        <CircleX size={18} color={"red"} />
                    </Button>
                </Tooltip>;
            },
        },
    ];

    const getRoomCapacity = (roomCode: string) => rooms?.data?.data?.items?.find(r => r.code === roomCode)?.capacity ?? 0;
    useEffect(() => {
        const timelinesArr = Object.values(timelines);
        const newCourseClassesTimelines: Record<string, string[]> = {  };
        const updateCourseClasses: Record<string, CourseClass> = { ...courseClasses  };
        selectedRowKeysParents.map(courseClassId => {
            const timelineOfCourseClass = timelinesArr?.filter(e => e?.id?.endsWith(courseClassId as string))
            
            
            const courseClass = courseClasses[courseClassId as string];
            newCourseClassesTimelines[courseClassId as string] = timelineOfCourseClass
                .map(t => t.id)
            updateCourseClasses[courseClassId as string] = {
                ...courseClass, 
                numberStudentsExpected: getRoomCapacity(timelinesArr?.[0]?.roomCode) ?? 0,
                // id: courseClassId as string
            } as CourseClass;
            
        });
        
        selectedRowKeysChildren.map(courseClassId => {
            const courseClass = courseClasses[courseClassId as string];
            const timelineOfCourseClass = timelinesArr?.filter(e => e?.id?.endsWith(courseClassId as string))
            newCourseClassesTimelines[courseClassId as string] = timelineOfCourseClass?.map(e => e.id);
            updateCourseClasses[courseClassId as string] = {
                ...courseClass,
                numberStudentsExpected: (timelinesArr?.map(t => getRoomCapacity(t?.roomCode) ?? 0))?.reduce((acc, cur) => acc + cur, 0),
            } as CourseClass;
        });
        
        dispatch(setCourseClassesTimelines({
            ...newCourseClassesTimelines
        }));
        dispatch(setCourseClasses({
            ...updateCourseClasses
        }))
        // dispatch(setCourseClasses)

        
    }, [timelines]);

    const handleCloseModal = () => {
        setOpenModal(false);
        dispatch(setCourseClasses({}));
        dispatch(setSelectedRowKeysParents([]));
        dispatch(setSelectedRowKeysChildren([]));
    };
    const {mutate, isPending, isSuccess} = useCreateCourseClass()
    const [form] = Form.useForm();
    console.log(currentChildSemester)
    return (
        <>
            <IconButton size="small" onClick={() => setOpenModal(true)}>
                <Settings size={15} />
            </IconButton>
            <Modal
                open={openModal}
                okButtonProps={{loading: isPending}}
                onCancel={() => {
                    setOpenModal(false)
                    handleCloseModal()
                }}
                footer={
                    <Button loading={isPending} type="primary" onClick={() => {
                        Object.values(courseClasses)?.filter(t => t.id?.startsWith("courseClass"))?.filter(e => e.parentCourseClassCode === null).map(e => {
                            const nameOfCourseClassParent = Object.entries(form.getFieldsValue())?.find(([key, value]) => key?.includes("text_courseClassParent"))?.[1] ?? "";
                            const weekOfCourseClassParent = Object.entries(form.getFieldsValue())?.find(([key, value]) => key?.includes("weeknumber_courseClassParent"))?.[1] ?? "";
                            const studentExceptOfCourseClassParent = Object.entries(form.getFieldsValue())?.find(([key, value]) => key?.includes("number_courseClassParent"))?.[1] ?? "";
                            return {
                                courseClassCode: `${subjectCode}_${currentParentSemester?.semesterCode}_Lecture_${e.id}`,
                                courseClassName: `${nameOfCourseClassParent}`,
                                courseClassType: 0,
                                subjectCode: subjectCode!,
                                numberStudentsExpected: +studentExceptOfCourseClassParent,
                                parentCourseClassCode: null,
                                stage: currentStageConfig ?? 0,
                                weekStart: +weekOfCourseClassParent as number,
                                semesterCode: currentParentSemester?.semesterCode,
                                slotTimelines: Object.keys(timelines).filter(key => key.includes(e.id as string))?.map(e => timelines[e]).map(t => ({
                                    roomCode: t.roomCode,
                                    dayOfWeek: t.dayOfWeek,
                                    slot: t.slots,
                                } as SlotTimelineModel))
                            } as unknown as CourseClassModel
                        }).forEach(e => {
                            mutate({
                                ...e
                            }, {
                                onSuccess: () => {toast.success("Tạo lớp học thành công!");},
                            })
                        })

                        Object.values(courseClasses)?.filter(t => t.id?.startsWith("courseClass"))?.filter(e => e.parentCourseClassCode !== null).map(e => {
                            const nameOfCourseClassChildren = Object.entries(form.getFieldsValue())?.find(([key, value]) => key === `text_courseClassChild_${e?.id?.split('_')?.[1]}`)?.[1] ?? "";
                            const weekOfCourseClassChildren = Object.entries(form.getFieldsValue())?.find(([key, value]) => key?.includes(`weeknumber_courseClassChild_${e?.id?.split('_')?.[1]}`))?.[1] ?? "";
                            const studentExceptOfCourseClassChildren = Object.entries(form.getFieldsValue())?.find(([key, value]) => key?.includes(`number_courseClassChild_${e?.id?.split('_')?.[1]}`))?.[1] ?? "";
                            return {
                                courseClassCode: `${subjectCode}_${currentParentSemester?.semesterCode}_Lab_${e.id}`,
                                courseClassName: nameOfCourseClassChildren,
                                courseClassType: 0,
                                subjectCode: subjectCode!,
                                numberStudentsExpected: +studentExceptOfCourseClassChildren,
                                parentCourseClassCode: `${subjectCode}_${currentParentSemester?.semesterCode}_Lecture_${e.parentCourseClassCode}`,
                                stage: currentStageConfig ?? 0,
                                weekStart: +weekOfCourseClassChildren,
                                semesterCode: currentParentSemester?.semesterCode,
                                slotTimelines: Object.keys(timelines).filter(key => key.includes(e.id as string))?.map(e => timelines[e]).map(t => ({
                                    roomCode: t.roomCode,
                                    dayOfWeek: t.dayOfWeek,
                                    slot: t.slots,
                                } as SlotTimelineModel))
                            } as unknown as CourseClassModel
                        }).forEach(e => {
                            mutate({
                                ...e
                            }, {
                                onSuccess: () => {toast.success("Tạo lớp học phần thành công!");},
                            })
                        })

                        
                    }}>
                        Lưu tất cả
                    </Button>
                }
                className={" min-w-[1500px]"}
                title={
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={16}
                        sx={{
                            padding: "9px 12px",
                            background: "#fff",
                            borderRadius: "12px 12px 0 0",
                            borderBottom: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px #dbeafe",
                        }}
                    >
                        <Avatar
                            icon={<BookOutlined />}
                            style={{
                                background: "#e6f7ff",
                                color: "#1677ff",
                                marginRight: 8,
                                width: 48,
                                height: 48,
                                fontSize: 28,
                            }}
                        />
                        <div>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Danh sách lớp học môn <span style={{ color: "#1677ff" }}>{getSubject?.subjectName}</span>
                            </Typography.Title>
                            <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                                Mã môn: {getSubject?.subjectCode}
                            </Typography.Text>
                        </div>
                        <Tag color="green"
                             style={{ marginLeft: "auto", fontSize: 16, padding: "6px 16px", borderRadius: 8 }}>
                            <UserOutlined /> Đã tạo: {courseClassesParent?.data?.data?.totalItems ?? 0} lớp
                        </Tag>
                    </Box>
                }
            >
                <div className={"grid grid-cols-12 w-full gap-3"}>
                    <Card
                        className={"col-span-6"}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 4px 16px #dbeafe",
                            width: "100%",
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between" pt={2} pb={1}>
                            <Typography.Title level={5} style={{ margin: 0 }}>Tổng quan lớp học <span className={"font-normal"}>{getSubject?.subjectName}</span></Typography.Title>
                            <Button
                                onClick={handleAddParentRow}
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ borderRadius: 6, fontWeight: 500 }}
                            >
                                Thêm lớp mới
                            </Button>
                        </Box>
                        <Box className={"py-5 grid grid-cols-3 gap-5"}>
                            <Typography.Title className={"col-span-3"} level={5} style={{ margin: 0 }}>Chọn giai đoạn</Typography.Title>
                            <Button size={"small"} 
                                    color={currentStageConfig == 0 ? "primary" : "default"} 
                                    onClick={() => {dispatch(setCurrentStageConfig(0))}}
                                    variant={"filled"} 
                                    
                            >
                                <span className={"font-bold  text-[12px]"}>GĐ1:</span>
                                <span className={" text-[12px]"}>{DateTimeFormat(currentChildSemester?.find(e => e?.semesterCode?.split('_')[3] === '1')?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(currentChildSemester?.find(e => e?.semesterCode?.split('_')[3] === '1')?.endDate, "DD/MM/YYYY")}</span>
                            </Button>
                            
                            <Button size={"small"}
                                    color={currentStageConfig == 1 ? "primary" : "default"}
                                    onClick={() => {dispatch(setCurrentStageConfig(1))}}
                                    variant={"filled"}
                            >
                                <span className={"font-bold  text-[12px]"}>GĐ2:</span>
                                <span className={" text-[12px]"}>{DateTimeFormat(currentChildSemester?.find(e => e?.semesterCode?.split('_')[3] === '2')?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(currentChildSemester?.find(e => e?.semesterCode?.split('_')[3] === '2')?.endDate, "DD/MM/YYYY")}</span>
                            </Button>
                            <Button 
                                size={"small"}
                                color={currentStageConfig == 2 ? "primary" : "default"}
                                onClick={() => {dispatch(setCurrentStageConfig(2))}}
                                variant={"filled"}
                                
                            >
                                <span className={"font-bold  text-[12px]"}>Cả 2 GĐ:</span>
                                <span className={" text-[12px]"}>{DateTimeFormat(currentParentSemester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(currentParentSemester?.endDate, "DD/MM/YYYY")}</span>
                            </Button>
                        </Box>
                        <Box  pb={2}>
                            <Form form={form} onChange={e => {  
                            }}>
                                <Table<CourseClass>
                                    rowKey={c => c.id}
                                    size="small"
                                    bordered
                                    loading={isLoading}
                                    scroll={{x: 1200}}
                                    style={{
                                        borderRadius: 10,
                                        background: "#fff",
                                        // height: "1200px"
                                    }}
                                    expandable={{
                                        defaultExpandAllRows: true,
                                        expandedRowRender: (record) => { 
                                            return <div className={"w-full flex flex-col inset-0  pl-10"}>
                                                
                                                <Table<CourseClass>
                                                    bordered
                                                    columns={childColumns}
                                                    size={"small"}
                                                    rootClassName={""}
                                                    rowKey={c => c.id}
                                                    pagination={false}
                                                    scroll={{x: 1200}}
                                                    components={{
                                                        body: { cell: (props) => <EditableCell {...props} /> },
                                                    }}
                                                    dataSource={courseClassDataSourceChild(record?.id.startsWith("courseClass") ? record?.id : record?.courseClassCode)}
                                                    rowSelection={{
                                                        type: "checkbox",
                                                        columnWidth: "3%",
                                                        fixed: "left",
                                                        selectedRowKeys: selectedRowKeysChildren,
                                                        onChange: (selectedKeys) => {
                                                            dispatch(setSelectedRowKeysChildren(selectedKeys));
                                                        },
                                                    }}
                                                    locale={{
                                                        emptyText: (
                                                            <Empty
                                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                                description={
                                                                    <span>
                                                            Chưa có lớp thành phần nào. <br /> Hãy nhấn <b> + </b>
                                                        </span>
                                                                }
                                                            />
                                                        ),
                                                    }}
                                                    rowClassName={(_, idx) =>
                                                        idx % 2 === 0 ? "table-row-odd" : "table-row-even"
                                                    }
                                                    footer={() => (
                                                        <div className={"flex justify-center items-center inset-0"}>
                                                            <Tooltip title={"Thêm lớp thành phần"} className={"w-min h-min"}>
                                                                <Button 
                                                                    disabled={getSubject?.labLesson === 0}
                                                                    size={"small"}
                                                                    style={{
                                                                        fontSize: 12
                                                                    }}
                                                                    className={"mx-auto w-min "}
                                                                    onClick={() => {
                                                                        handleAddChildRow(record.id);
                                                                    }}
                                                                >
                                                                    Thêm lớp thành phần<Plus size={15} />
                                                                </Button>
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            
                                        },
                                        columnWidth: "3%"
                                        
                                    }}
                                    components={{
                                        body: { cell: EditableCell },
                                    }}
                                    pagination={{
                                        current: query?.Page ?? 1,
                                        pageSize: query?.PageSize ?? 10,
                                        total: courseClassesParent?.data?.data?.totalItems ?? 0,
                                        showSizeChanger: true,
                                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bản ghi`
                                    }}

                                    onChange={e => setQuery(prevState => ({
                                        ...prevState,
                                        Page: e?.current ?? 1 - 1,
                                        PageSize: e?.pageSize,
                                    }))}

                                    columns={columns }
                                    dataSource={courseClassDataSourceParent ?? []}
                                    // dataSource={courseClasses?.data?.data?.items ?? []}
                                    locale={{
                                        emptyText: (
                                            <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <span>
                                                            Chưa có lớp học nào. <br /> Hãy nhấn <b>Thêm lớp mới</b>
                                                        </span>
                                                }
                                            />
                                        ),
                                    }}
                                    rowClassName={(_, idx) =>
                                        idx % 2 === 0 ? "table-row-odd" : "table-row-even"
                                    }
                                    rowSelection={{
                                        type: "checkbox",
                                        columnWidth: 10,
                                        fixed: "left",
                                        selectedRowKeys: selectedRowKeysParents,
                                        onChange: (selectedKeys) => {
                                            dispatch(setSelectedRowKeysParents(selectedKeys));
                                        },
                                    }}
                                />
                            </Form>
                        </Box>
                    </Card>
                    <Card
                        className={"col-span-6"}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 4px 16px #dbeafe",
                            padding: 0,
                            minHeight: 540,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={3} px={3} pt={3} pb={1} style={{
                            borderBottom: "1px solid #f0f0f0",
                            marginBottom: 0,
                        }}>
                            <BookOutlined style={{ marginRight: 10, color: "#1677ff", fontSize: 24 }} />
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                Sắp xếp lịch học & phòng học
                            </Typography.Title>
                            
                        </Box>
                        <Box  py={2} style={{ minHeight: 350 }}>
                            <TableSchedule   />
                        </Box>
                    </Card>
                </div>
            </Modal>
        </>
    );
};

export default StudySectionCourseClasses;