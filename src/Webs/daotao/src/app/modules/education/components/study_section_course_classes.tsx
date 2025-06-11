import { ArrowRight, CircleCheck, CircleX, Settings, Trash2, Plus } from "lucide-react";
import { Box, IconButton } from "@mui/material";
import {
    Button, Form, Input, Modal, Table, Typography, Tag, Tooltip, Space,
    Avatar, Empty, Badge, Card, Spin, Select
} from "antd";
import React, { useEffect, useState } from "react";
import { ColumnType } from "antd/es/table";
import { CourseClass } from "@/domain/course_class.ts";
import { DateTimeFormat } from "@/infrastructure/date.ts";
import { useGetSemesters } from "@/app/modules/education/hooks/useGetSemesters.ts";
import { useGetSubjects } from "@/app/modules/subject/hooks/hook.ts";
import { useGetCourseClasses } from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import { Query } from "@/infrastructure/query.ts";
import { useGetTimeline } from "@/app/modules/education/hooks/useGetTimeline.ts";
import {getStageText, useGetRooms} from "@/app/modules/common/hook.ts";
import EditableCell from "@/app/modules/education/components/edit_cell.tsx";
import TableSchedule from "@/app/modules/education/components/table_schedule.tsx";
import _ from "lodash"
import {
    BookOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    UserOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { SlotTimeline } from "@/domain/slot_timeline.ts";
import toast from "react-hot-toast";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {
    setCourseClassesNew, setCurrentStageConfig, setScheduleItem,
    setSubject,
    SubjectStudySectionState
} from "@/app/modules/education/stores/subject_study_section.ts";
import {Subject} from "@/domain/subject.ts";

type EditableColumnType<T> = ColumnType<T> & {
    editable?: boolean;
    inputType?: 'text' | 'select' | 'button' | 'list';
};

export type StudySectionCourseClassesProps = {
    subject: Subject
}
const StudySectionCourseClasses = ({subject}: StudySectionCourseClassesProps) => {
    const {courseClassesNew, currentStageConfig, scheduleItems} = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);
    const dispatch = useAppDispatch()
    const subjectCode = subject?.subjectCode;

    useEffect(() => {
        if (subject) {
            dispatch(setSubject(subject));
        }
    }, [subject]);

    const [openModal, setOpenModal] = useState(false);
    const [showScheduleRecord, setShowScheduleRecord] = useState<CourseClass | null>(null);
    // --- SỬA: Tách selectedRowKeys cho từng bảng ---
    const [selectedRowKeysParent, setSelectedRowKeysParent] = useState<React.Key[]>([]);
    const [selectedRowKeysChildren, setSelectedRowKeysChildren] = useState<Record<string, React.Key[]>>({});

    const [timelinesById, setTimelinesById] = useState<Record<string, SlotTimeline[]>>({});

    
    // ------------------------------------------------
    const { data: semesters, isLoading: semesterLoading } = useGetSemesters(
        { Filters: [{ field: "SemesterStatus", operator: "In", value: "0,1" }] },
        openModal
    );
    const getSemester = (stage: number) =>
        semesters?.data?.data?.items?.find(
            (e) => +e?.semesterCode?.split("_")[3] === stage + 1
        ) ?? undefined;
    const semesterParent = semesters?.data?.data?.items?.find(
        (e) => e?.semesterCode === semesters?.data?.data?.items?.[0]?.parentSemesterCode
    );

    const semesterOptions =
        semesters?.data?.data?.items?.map((s) => ({
            value: s?.semesterCode,
            label: (
                <>
                    {getStageText(s?.semesterCode)}
                    {" "}
                    <span style={{ color: "#888" }}>
                        ({DateTimeFormat(s?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(s?.endDate, "DD/MM/YYYY")})
                    </span>
                </>
            ),
        })) ?? [];

    const { data: subjects } = useGetSubjects(
        { Filters: [{ field: "SubjectCode", operator: "==", value: subjectCode! }] },
        subjectCode !== undefined
    );
    const getSubject = subjects?.data?.data?.items?.[0];

    const [query, setQuery] = useState<Query>({
        Filters: [
            // { field: "SubjectCode", operator: "==", value: subjectCode! },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
    });

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
    const { data: courseClasses, isLoading } = useGetCourseClasses(
        query,
        subjectCode !== undefined && openModal && subjectCode !== ""
    );
    
    
    

    useEffect(() => {
        if (subjectCode && subjectCode !== "") {
            setQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters ?? [],
                    { field: "SubjectCode", operator: "==", value: subjectCode! },
                    // { field: "SemesterCode", operator: "==", value: semesterParent?.semesterCode! },
                ],
            }))
        }
    }, [subjectCode]);
    
    const { data: courseClassesChild } = useGetCourseClasses({
        Filters: [
            { field: "ParentCourseClassCode", operator: "In", value: courseClasses?.data?.data?.items?.map(e => e.courseClassCode)?.join(",")! },
            { field: "Stage", operator: "==", value: `${currentStageConfig}` },
        ],
    }, courseClasses !== undefined && courseClasses?.data?.data?.items?.length > 0 && openModal);

    const getChildrenCourseClasses = (courseClassCode: string): CourseClass[] => 
        courseClassesChild?.data?.data?.items?.filter(
        (c) => c.parentCourseClassCode === courseClassCode
    ) ?? [];
    
    
    const { data: timeLines } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: [
                        ...courseClasses?.data?.data?.items?.map((c) => c.courseClassCode) ?? [],
                        ...courseClassesChild?.data?.data?.items?.map((c) => c.courseClassCode) ?? [],
                    ]?.join(",")!,
                },
            ],
        },
        courseClasses !== undefined &&
        courseClasses?.data?.data?.items?.map((c) => c.courseClassCode)?.length > 0 &&
        openModal &&
        subjectCode !== undefined && 
        courseClassesChild !== undefined
    );
    const [form] = Form.useForm();

    useEffect(() => {
        if (courseClasses?.data?.data?.items) {
            const list = courseClasses.data.data.items;
            setCourseClassesView(list);
            form.setFieldsValue(
                list.reduce((acc, r) => {
                    acc[r.id] = r; // chỉ gán các field sẵn có
                    return acc;
                }, {} as Record<string, any>)
            );
        }
    }, [courseClasses, form]);
    

    
    
    
    useEffect(() => {
        if (courseClasses && courseClasses.data && courseClasses.data.data && courseClasses.data.data.items) {
            setCourseClassesView(courseClasses.data.data.items);
        }
    }, [courseClasses]);

    const [selectedTimeline, setSelectedTimeline] = useState<SlotTimeline[]>([])
    const [editingKeys, setEditingKeys] = useState<string[]>([])
    const [courseClassesView, setCourseClassesView] = useState<CourseClass[]>([]);
    const isEditing = (record: CourseClass) => editingKeys.includes(record.id as string);

    const cancelParent = () => setEditingKeys([]);
    const saveParent = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as CourseClass;
            const newData = [...courseClassesView];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setEditingKeys([]);
            }
        } catch { }
    };

    const handleAddParentRow = () => {
        dispatch(setScheduleItem([]))
        const newRow = {
            id: `new_${Date.now()}`,
            courseClassName: "",
            teacherName: "",
            stage: semesterOptions[0]?.value ?? 0,
            parentCourseClassCode: null,
        } as unknown as CourseClass;
        dispatch(setCourseClassesNew([...courseClassesNew ?? [], newRow]));
        setCourseClassesView((prev) => [newRow, ...prev]);
        setSelectedRowKeysParent((prev) => [newRow.id, ...prev]);
        form.setFieldsValue({ [newRow.id]: { ...newRow } });
        setEditingKeys(prevState => [...prevState, newRow.id as string]);
    };

    const handleAddChildrenRow = (parentId: string) => {
        dispatch(setScheduleItem([]))
        const newRow = {
            id: `new_${Date.now()}`,
            courseClassName: "",
            teacherName: "",
            stage: semesterOptions[0]?.value ?? 0,
            parentCourseClassCode: parentId,
        } as unknown as CourseClass;
        dispatch(setCourseClassesNew([...courseClassesNew ?? [], newRow]));
        setCourseClassesView((prev) => {
            const parentIdx = prev.findIndex((p) => p.id === parentId);
            if (parentIdx === -1) return [newRow, ...prev];
            const newArr = [...prev];
            newArr.splice(parentIdx + 1, 0, newRow);
            return newArr;
        });
        // SỬA: Tách selectedRowKeys cho từng bảng con
        setSelectedRowKeysChildren(prev => ({
            ...prev,
            [parentId]: [newRow.id, ...(prev[parentId] ?? [])]
        }));
        form.setFieldsValue({ [newRow.id]: { ...newRow } });
        setEditingKeys((prevState) => [...prevState, newRow.id as string]);
    };

    const getChildrenRows = (parentId: string) =>
        (courseClassesView ?? []).filter(
            (c) => c.parentCourseClassCode === parentId
        );
    
    

    // Cấu hình column: Thêm name cho từng dòng (theo [record.id, dataIndex])
    const columns: EditableColumnType<CourseClass>[] = [
        {
            title: "Tên lớp",
            dataIndex: "courseClassName",
            width: 50,
            editable: true,
            inputType: "text",
            className: "text-[12px]",
            onCell: (record: CourseClass) => ({
                record,
                inputType: "text",
                dataIndex: "courseClassName",
                title: "Tên lớp",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "courseClassName"]
            }),
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Space>
                        <Badge
                            status={
                                timeLines?.data?.data?.items?.some(c => c.courseClassCode === record?.courseClassCode)
                                    ? "success"
                                    : "default"
                            }
                        />
                        <span className="font-bold">{record?.courseClassName ||
                            <span className="text-gray-400">[Chưa đặt tên]</span>}</span>
                    </Space>
                    <span className="text-gray-500 text-xs">{getSubject?.subjectName}</span>
                </Space>
            ),
        },
        {
            title: "Lịch học",
            key: "timeline",
            className: "text-[12px]",

            width: 60,
            render: (_: any, record: CourseClass) => {
                // chỉ đọc từ map, không fallback record.timeline
                const items = timelinesById[record.id] ?? timeLines?.data?.data?.items?.filter(e => e.courseClassCode === record?.courseClassCode) ?? [];
                if (items.length === 0) {
                    return <Tag color="default">Chưa xếp</Tag>
                }
                return (
                    <div className="whitespace-nowrap">
                        {items.map((e, index) => (
                            <div key={`${record.id}-${e.id}`} className="flex items-center gap-1">
                                <span className={"font-bold"}>Buổi {index + 1}: </span>
                                <span className={` ${e?.roomCode ? "text-blue-600" : "text-red-600"} font-medium`}>Phòng {e?.roomCode || "?"}</span>
                                Thứ {e.dayOfWeek + 2} (Tiết {e.slots?.map(e => +e + 1).join(",")})
                            </div>
                        ))}
                    </div>
                )
            }
        },
        {
            title: "Thời gian",
            dataIndex: "stage",
            width: 50,
            editable: true,
            inputType: "select",
            className: "text-[12px]",
            onCell: (record: CourseClass) => ({
                record,
                inputType: "select",
                dataIndex: "stage",
                title: "Thời gian",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "stage"]
            }),
            render: (_, record) => {
                const semester = getSemester(record?.stage);
                return (
                    <Tag color="blue" style={{ fontWeight: 500, display: "flex", flexDirection: "column"}}>
                        <span>
                            {getStageText(semester?.semesterCode ?? "1")}
                        </span>
                        <span style={{ color: "#888" }}> ({DateTimeFormat(semester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(semester?.endDate, "DD/MM/YYYY")})</span>
                    </Tag>
                );
            },
        },
        {
            title: "Số SV dự kiến",
            className: "text-[12px]",
            editable: true,
            inputType: "text",
            width: 40,
            onCell: (record: CourseClass) => ({
                record,
                inputType: "text",
                dataIndex: "numberStudents",
                title: "Tên lớp",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "numberStudents"]
            }),
            render: (text, record) =>
                record?.numberStudentsExpected
                    ? (
                        <Space>
                            <Avatar size={22} icon={<UserOutlined />} />
                            {record.numberStudentsExpected} (SV)
                        </Space>
                    )
                    : <Tag color="orange">Chưa xếp</Tag>
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
                return record?.id?.startsWith("new_") ? (
                    <>
                        <Tooltip title={"Xóa"}>
                            <Button type="link" size="small" onClick={() => {
                                setEditingKeys(prevState => prevState.filter(key => key !== record.id));
                                form.resetFields([record.id]);
                                setCourseClassesView(prev => prev.filter(item => item.id !== record.id));
                            }}>
                                <CircleX size={18} color={"red"} />
                            </Button>
                        </Tooltip>
                    </>
                ) : null;
            },
        },
    ];

    const childrenColumns: EditableColumnType<CourseClass>[] = [
        {
            title: "Các lớp thành phần",
            dataIndex: "courseClassName",
            width: 80,
            editable: true,
            inputType: "text",
            className: "text-[12px]",
            onCell: (record: CourseClass) => ({
                record,
                inputType: "text",
                dataIndex: "courseClassName",
                title: "Tên lớp thành phần",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "courseClassName"]
            }),
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Space>
                        <Badge
                            status={
                                timeLines?.data?.data?.items?.some(c => c.courseClassCode === record?.courseClassCode)
                                    ? "success"
                                    : "default"
                            }
                        />
                        <span className="font-bold">{record?.courseClassName ||
                            <span className="text-gray-400">[Chưa đặt tên]</span>}</span>
                    </Space>
                    <span className="text-gray-500 text-xs">{getSubject?.subjectName}</span>
                </Space>
            ),
        },
        {
            title: "Lịch học",
            key: "timeline",
            className: "text-[12px]",
            width: 90,
            render: (_: any, record: CourseClass) => {
                // chỉ đọc từ map, không fallback record.timeline
                const items = timelinesById[record.id] ?? timeLines?.data?.data?.items?.filter(e => e.courseClassCode === record?.courseClassCode) ?? [];
                if (items.length === 0) {
                    return <Tag color="default">Chưa xếp</Tag>
                }
                return (
                    <div className="whitespace-nowrap">
                        {items.map((e, index) => (
                            <div key={`${record.id}-${e.id}`} className="flex items-center gap-1">
                                <span className={"font-bold"}>Buổi {index + 1}: </span>
                                <span className={` ${e?.roomCode ? "text-blue-600" : "text-red-600"} font-medium`}>Phòng {e?.roomCode || "?"}</span>
                                Thứ {e.dayOfWeek + 2} (Tiết {e.slots?.map(e => +e + 1).join(",")})
                            </div>
                        ))}
                    </div>
                )
            }
        },
        {
            title: "Thời gian",
            dataIndex: "stage",
            width: 70,
            editable: true,
            inputType: "select",
            className: "text-[12px]",
            onCell: (record: CourseClass) => ({
                record,
                inputType: "select",
                dataIndex: "stage",
                title: "Thời gian",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "stage"]
            }),
            render: (_, record) => {
                const semester = getSemester(record?.stage);
                return (
                    <Tag color="blue" style={{ fontWeight: 500, display: "flex", flexDirection: "column"}}>
                        <span>
                            {getStageText(semester?.semesterCode ?? "1")}
                        </span>
                        <span style={{ color: "#888" }}> ({DateTimeFormat(semester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(semester?.endDate, "DD/MM/YYYY")})</span>
                    </Tag>
                );
            },
        },
        {
            title: "Số SV",
            className: "text-[12px]",
            editable: true,
            inputType: "text",
            width: 40,
            onCell: (record: CourseClass) => ({
                record,
                inputType: "text",
                dataIndex: "numberStudents",
                title: "Tên lớp",
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
                name: [record.id, "numberStudents"]
            }),
            render: (text, record) =>
                record?.numberStudentsExpected
                    ? (
                        <Space>
                            <Avatar size={22} icon={<UserOutlined />} />
                            {record.numberStudentsExpected} (SV)
                        </Space>
                    )
                    : <Tag color="orange">Chưa xếp</Tag>
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
                return record?.id?.startsWith("new_") ? (
                    <>
                        <Tooltip title={"Xóa"}>
                            <Button type="link" size="small" onClick={() => {
                                setEditingKeys(prevState => prevState.filter(key => key !== record.id));
                                form.resetFields([record.id]);
                                setCourseClassesView(prev => prev.filter(item => item.id !== record.id));
                            }}>
                                <CircleX size={18} color={"red"} />
                            </Button>
                        </Tooltip>
                    </>
                ) : null;
            },
        },
    ];

    // Hàm lưu toàn bộ form
    const handleSaveAll = async () => {
        const values = await form.validateFields();
        const data = Object.entries(values).map(([id, fields]) => ({
            id,
            //@ts-ignore
            ...fields,
        }));
        const parents = data.filter(row => !row.parentCourseClassCode);
        const children = data.filter(row => !!row.parentCourseClassCode);
        toast.success("Đã lưu tất cả dữ liệu!");
        console.log({ all: data, parents, children });
    };





    const allSelectedChildIds = Object.values(selectedRowKeysChildren).flat();

    useEffect(() => {
        if (scheduleItems && scheduleItems.length && (selectedRowKeysParent.length || allSelectedChildIds.length)) {
            setTimelinesById(prev => {
                const next = { ...prev };
                selectedRowKeysParent
                    ?.filter(e => e?.toString()?.startsWith("new_"))
                    .forEach(id => {
                        next[id as string] = scheduleItems.map(item => ({
                            id: item.id,
                            roomCode: item.roomCode ?? "",
                            dayOfWeek: item.dayIndex,
                            slots: Array.from(
                                { length: item.endSlot - item.startSlot + 1 },
                                (_, index) => item.startSlot + index
                            ),
                            courseClassCode: id as string,
                        } as unknown as SlotTimeline));
                    });
                // Cập nhật cho child
                allSelectedChildIds
                    ?.filter(e => e?.toString()?.startsWith("new_"))
                    .forEach(id => {
                        next[id as string] = scheduleItems.map(item => ({
                            id: item.id,
                            roomCode: item.roomCode ?? "",
                            dayOfWeek: item.dayIndex,
                            slots: Array.from(
                                { length: item.endSlot - item.startSlot + 1 },
                                (_, index) => item.startSlot + index
                            ),
                            courseClassCode: id as string,
                        } as unknown as SlotTimeline));
                    });
                return next;
            });
        }
    }, [scheduleItems, selectedRowKeysParent, selectedRowKeysChildren]);
    
    
    return (
        <>
            <IconButton size="small" onClick={() => setOpenModal(true)}>
                <Settings size={15} />
            </IconButton>
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={
                    <Button type="primary" onClick={handleSaveAll}>
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
                            <UserOutlined /> Đã tạo: {courseClasses?.data?.data?.totalItems ?? 0} lớp
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
                            <Typography.Title level={5} style={{ margin: 0 }}>Tổng quan lớp học <span className={"font-normal"}>{subject?.subjectName}</span></Typography.Title>
                            <Button
                                onClick={handleAddParentRow}
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ borderRadius: 6, fontWeight: 500 }}
                            >
                                Thêm lớp mới
                            </Button>
                        </Box>
                        <Box className={"py-5 flex flex-row justify-start items-center gap-5"}>
                            <Typography.Title level={5} style={{ margin: 0 }}>Chọn giai đoạn</Typography.Title>
                            <Button size={"small"} 
                                    color={currentStageConfig == 0 ? "primary" : "default"} 
                                    onClick={() => {dispatch(setCurrentStageConfig(0))}}
                                    variant={"filled"} >
                                Giai đoạn 1
                            </Button>
                            
                            <Button size={"small"}
                                    color={currentStageConfig == 1 ? "primary" : "default"}
                                    onClick={() => {dispatch(setCurrentStageConfig(1))}}
                                    variant={"filled"}
                            >
                                Giai đoạn 2
                            </Button>
                            <Button 
                                size={"small"}
                                color={currentStageConfig == 2 ? "primary" : "default"}
                                onClick={() => {dispatch(setCurrentStageConfig(2))}}
                                variant={"filled"}
                                
                            >
                                Cả 2 giai đoạn
                            </Button>
                        </Box>
                        <Box  pb={2}>
                            <Form form={form} component={false}>
                                <Table<CourseClass>
                                    rowKey={c => c.id}
                                    size="small"
                                    bordered
                                    loading={isLoading}
                                    scroll={{x: 1200}}
                                    style={{
                                        borderRadius: 10,
                                        background: "#fff",
                                        height: "1200px"
                                    }}
                                    pagination={{
                                        current: query?.Page ?? 1,
                                        pageSize: query?.PageSize ?? 10,
                                        total: courseClasses?.data?.data?.totalItems ?? 0,
                                        showSizeChanger: true,
                                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bản ghi`
                                    }}
                                    expandable={{
                                        showExpandColumn: true,
                                        defaultExpandAllRows: true,
                                        fixed: "left",
                                        columnWidth: 10,
                                        expandedRowRender: (record) => (
                                            <div className={"inset-0 pl-15"}>
                                                <Button
                                                    size="small"
                                                    icon={<PlusOutlined />}
                                                    style={{borderRadius: 6, fontWeight: 500, padding: "4px 8px", margin: "1px"}}
                                                    onClick={() => {
                                                        handleAddChildrenRow(record.id)
                                                    }}
                                                >
                                                    Thêm lớp thành phần
                                                </Button>
                                                <Table<CourseClass>
                                                    components={{
                                                        body: {
                                                            cell: (props: any) => (
                                                                <EditableCell
                                                                    {...props}
                                                                    semesterOptions={semesterOptions}
                                                                    onShowSchedule={setShowScheduleRecord}
                                                                />
                                                            ),
                                                        },
                                                    }}
                                                    rowKey={c => c.id}
                                                    size={"small"}
                                                    scroll={{x: 1200}}
                                                    bordered
                                                    columns={childrenColumns as ColumnType<CourseClass>[]}
                                                    rowSelection={{
                                                        type: "checkbox",
                                                        selectedRowKeys: selectedRowKeysChildren[record.id] || [],
                                                        onChange: keys => setSelectedRowKeysChildren(prev => ({
                                                            ...prev,
                                                            [record.id]: keys
                                                        })),
                                                        fixed: "left",
                                                        columnWidth: 20,
                                                    }}
                                                    // dataSource={getChildrenRows(record.id)}
                                                    dataSource={[...(getChildrenCourseClasses(record.courseClassCode) ?? []), ...getChildrenRows(record.id)]}
                                                    pagination={false}
                                                    locale={{
                                                        emptyText: (
                                                            <Empty
                                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                                description={
                                                                    <span>
                                                                            Chưa có lớp thành phần.<br />Hãy nhấn <b>Thêm lớp thành phần</b>
                                                                        </span>
                                                                }
                                                            />
                                                        ),
                                                    }}
                                                    rowClassName={(_, idx) =>
                                                        idx % 2 === 0 ? "table-row-odd" : "table-row-even"
                                                    }
                                                />
                                            </div>
                                        )
                                    }}
                                    onChange={e => setQuery(prevState => ({
                                        ...prevState,
                                        Page: e?.current ?? 1 - 1,
                                        PageSize: e?.pageSize,
                                    }))}
                                    components={{
                                        body: {
                                            cell: (props: any) => (
                                                <EditableCell
                                                    {...props}
                                                    semesterOptions={semesterOptions}
                                                    onShowSchedule={setShowScheduleRecord}
                                                />
                                            ),
                                        },
                                    }}
                                    columns={columns as ColumnType<CourseClass>[]}
                                    dataSource={courseClassesView?.filter(e => e.parentCourseClassCode === null) ?? []}
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
                                        selectedRowKeys: selectedRowKeysParent,
                                        onChange: (selectedKeys) => {
                                            setSelectedRowKeysParent(selectedKeys);
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