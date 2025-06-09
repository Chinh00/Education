import { ArrowRight, Settings } from "lucide-react";
import { Box, IconButton } from "@mui/material";
import { Button, Form, Input, Modal, Table, Typography, Tag, Tooltip, Space, Avatar, Empty, Badge, Card, Spin } from "antd";
import { useEffect, useState } from "react";
import { ColumnType } from "antd/es/table";
import { CourseClass } from "@/domain/course_class.ts";
import { DateTimeFormat } from "@/infrastructure/date.ts";
import { useGetSemesters } from "@/app/modules/education/hooks/useGetSemesters.ts";
import { useGetSubjects } from "@/app/modules/subject/hooks/hook.ts";
import { useGetCourseClasses } from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import { Query } from "@/infrastructure/query.ts";
import { useGetTimeline } from "@/app/modules/education/hooks/useGetTimeline.ts";
import { getStageText } from "@/app/modules/common/hook.ts";
import EditableCell from "@/app/modules/education/components/edit_cell.tsx";
import TableSchedule from "@/app/modules/education/components/table_schedule.tsx";
import { BookOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";

type EditableColumnType<T> = ColumnType<T> & {
    editable?: boolean;
    inputType?: 'text' | 'select' | 'button';
};

export type StudySectionCourseClassesProps = {
    subjectCode?: string;
};

const StudySectionCourseClasses = ({ subjectCode }: StudySectionCourseClassesProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [showScheduleRecord, setShowScheduleRecord] = useState<CourseClass | null>(null);

    const { data: semesters, isLoading: semesterLoading } = useGetSemesters(
        { Filters: [{ field: "SemesterStatus", operator: "==", value: "0" }] },
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
            label: <>
                {getStageText(s?.semesterCode ?? 0)}
                {" "}
                <span style={{ color: "#888" }}>({DateTimeFormat(s?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(s?.endDate, "DD/MM/YYYY")})</span>
            </>,
        })) ?? [];

    const { data: subjects } = useGetSubjects(
        { Filters: [{ field: "SubjectCode", operator: "==", value: subjectCode! }] },
        subjectCode !== undefined
    );
    const getSubject = subjects?.data?.data?.items?.[0];

    const [query, setQuery] = useState<Query>({
        Filters: [
            { field: "SubjectCode", operator: "==", value: subjectCode! },
            { field: "SemesterCode", operator: "==", value: semesterParent?.semesterCode! },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
    });

    const { data, isLoading } = useGetCourseClasses(
        query,
        semesterParent !== undefined && openModal && subjectCode !== undefined
    );
    const { data: timeLine } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: data?.data?.data?.items?.map((c) => c.courseClassCode)?.join(",")!,
                },
            ],
        },
        data !== undefined &&
        data?.data?.data?.items?.map((c) => c.courseClassCode)?.length > 0 &&
        openModal &&
        subjectCode !== undefined
    );

    // Editable Table state
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string>("");
    const [customDataSource, setCustomDataSource] = useState<CourseClass[]>([]);

    useEffect(() => {
        if (data?.data?.data?.items) {
            setCustomDataSource(data.data.data.items);
        }
    }, [data]);

    const isEditing = (record: CourseClass) => record.id === editingKey;

    const edit = (record: Partial<CourseClass> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id as string);
    };

    const cancel = () => setEditingKey("");

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as CourseClass;
            const newData = [...customDataSource];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setCustomDataSource(newData);
                setEditingKey("");
            }
        } catch {}
    };

    const handleAddRow = () => {
        const newRow = {
            id: `${Date.now()}`,
            courseClassName: "",
            teacherName: "",
            stage: semesterOptions[0]?.value ?? 0,
            parentCourseClassCode: "",
        } as unknown as CourseClass;
        setCustomDataSource((prev) => [newRow, ...prev]);
        setTimeout(() => edit(newRow), 20);
    };

    // Columns
    const columns: EditableColumnType<CourseClass>[] = [
        {
            title: "Tên lớp",
            dataIndex: "courseClassName",
            width: 130,
            editable: true,
            inputType: "text",
            className: "text-[12px]",
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Space>
                        <Badge
                            status={
                                timeLine?.data?.data?.items?.some(c => c.courseClassCode === record?.courseClassCode)
                                    ? "success"
                                    : "default"
                            }
                        />
                        <span className="font-bold">{record?.courseClassName || <span className="text-gray-400">[Chưa đặt tên]</span>}</span>
                    </Space>
                    <span className="text-gray-500 text-xs">{getSubject?.subjectName}</span>
                </Space>
            ),
        },
        {
            title: "Thời gian",
            dataIndex: "stage",
            width: 150,
            editable: true,
            inputType: "select",
            className: "text-[12px]",
            render: (_, record) => {
                const semester = getSemester(record?.stage);
                return (
                    <Tag color="blue" style={{ fontWeight: 500 }}>
                        {getStageText(semester?.semesterCode)}
                        <span style={{ color: "#888" }}> ({DateTimeFormat(semester?.startDate, "DD/MM/YYYY")} - {DateTimeFormat(semester?.endDate, "DD/MM/YYYY")})</span>
                    </Tag>
                );
            },
        },
        {
            title: "Lịch học",
            key: "timeline",
            className: "text-[12px]",
            width: 170,
            render: (_, record) => {
                const items = timeLine?.data?.data?.items?.filter(
                    (c) => c.courseClassCode === record?.courseClassCode
                );
                return items && items.length > 0 ? (
                    <Tooltip
                        title={<>
                            {items.map(e =>
                                <div key={e.id}>
                                    <span className="font-medium text-blue-600">Phòng {e.roomCode}</span> Thứ {e.dayOfWeek + 2} (Tiết {e.slots?.join(",")})
                                </div>
                            )}
                        </>}
                    >
                        <Tag color="green" style={{ cursor: "pointer", fontWeight: 500 }}>Đã xếp ({items.length} lịch)</Tag>
                    </Tooltip>
                ) : (
                    <Tag color="default">Chưa xếp</Tag>
                );
            },
        },
        {
            title: "Giảng viên",
            dataIndex: "teacherName",
            className: "text-[12px]",
            width: 150,
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
            title: "Thao tác",
            dataIndex: "operation",
            width: 110,
            align: "center" as const,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button type="link" size="small" onClick={() => save(record.id)}>
                            Lưu
                        </Button>
                        <Button type="link" size="small" onClick={cancel}>
                            Huỷ
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Tooltip title="Sửa">
                            <Button shape="circle" icon={<EditOutlined />} size="small" onClick={() => edit(record)} />
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button shape="circle" icon={<DeleteOutlined />} size="small" danger />
                        </Tooltip>
                        <Tooltip title="Xem chi tiết">
                            <Button shape="circle" icon={<InfoCircleOutlined />} size="small" />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    // Merge column for editable
    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record: CourseClass) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                semesterOptions,
                onShowSchedule: setShowScheduleRecord,
            }),
        };
    });

    // Children table and timeline as before
    const { data: childrenCourseClasses } = useGetCourseClasses(
        {
            Filters: [
                {
                    field: "ParentCourseClassCode",
                    operator: "In",
                    value: data?.data?.data?.items?.map((e) => e.courseClassCode)?.join(",")!,
                },
            ],
        },
        data !== undefined && data?.data?.data?.items?.length > 0
    );

    const { data: childrenTimeLine } = useGetTimeline(
        {
            Filters: [
                {
                    field: "CourseClassCode",
                    operator: "In",
                    value: childrenCourseClasses?.data?.data?.items
                        ?.map((c) => c.courseClassCode)
                        ?.join(",")!,
                },
            ],
        },
        childrenCourseClasses !== undefined &&
        childrenCourseClasses?.data?.data?.items?.map((c) => c.courseClassCode)?.length > 0
    );

    const childrenColumns: EditableColumnType<CourseClass>[] = [
        {
            title: <span className="font-bold text-cyan-700">Các lớp thành phần</span>,
            dataIndex: "courseClassName",
            width: 200,
            className: "text-[12px]",
            render: (_, record) => (
                <Space direction="vertical" size={0} style={{ paddingLeft: 12 }}>
                    <span className="font-medium">{record?.courseClassName}</span>
                    <span className="text-gray-500 text-xs">{getSubject?.subjectName}</span>
                </Space>
            ),
        },
        {
            title: "Thời gian",
            dataIndex: "courseClassName",
            className: "text-[12px]",
            width: 120,
            render: (_, record) => (
                <Tag color="blue" style={{ fontWeight: 500 }}>
                    {DateTimeFormat(getSemester(record?.stage)?.startDate, "DD/MM/YYYY")}
                    <ArrowRight size={14} />
                    {DateTimeFormat(getSemester(record?.stage)?.endDate, "DD/MM/YYYY")}
                </Tag>
            ),
        },
        {
            title: "Lịch học",
            key: "action",
            className: "text-[12px]",
            width: 160,
            render: (_, record) => {
                const items = childrenTimeLine?.data?.data?.items?.filter(
                    (c) => c.courseClassCode === record?.courseClassCode
                );
                return items && items.length > 0 ? (
                    <Tooltip
                        title={<>
                            {items.map(e =>
                                <div key={e.id}>
                                    <span className="font-medium text-blue-600">Phòng {e.roomCode}</span> Thứ {e.dayOfWeek + 2} (Tiết {e.slots?.join(",")})
                                </div>
                            )}
                        </>}
                    >
                        <Tag color="green" style={{ cursor: "pointer", fontWeight: 500 }}>Đã xếp ({items.length} lịch)</Tag>
                    </Tooltip>
                ) : (
                    <Tag color="default">Chưa xếp</Tag>
                );
            },
        },
        {
            title: "Giảng viên",
            className: "text-[12px]",
            render: (text, record) =>
                record?.teacherCode
                    ? (
                        <Space>
                            <Avatar size={20} icon={<UserOutlined />} />
                            {record.teacherName}
                        </Space>
                    )
                    : <Tag color="orange">Chưa xếp</Tag>
        },
    ];

    return (
        <>
            <IconButton size="small" onClick={() => setOpenModal(true)}>
                <Settings size={15} />
            </IconButton>
            <Modal
                loading={semesterLoading}
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                footer={null}
                className={"study-modal min-w-[1500px]"}
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
                        <Tag color="green" style={{ marginLeft: "auto", fontSize: 16, padding: "6px 16px", borderRadius: 8 }}>
                            <UserOutlined /> Đã tạo: {data?.data?.data?.totalItems ?? 0} lớp
                        </Tag>
                    </Box>
                }
            >
                <div
                    
                    className={"grid grid-cols-12 w-full gap-3"}
                >
                    {/* LEFT: Lớp học */}
                    <Card
                        className={"col-span-6"}
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 4px 16px #dbeafe",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 540,
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            px={2}
                            pt={2}
                            pb={1}
                        >
                            <Typography.Title level={5} style={{ margin: 0 }}>Tổng quan lớp học</Typography.Title>
                            <Button
                                onClick={handleAddRow}
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ borderRadius: 6, fontWeight: 500 }}
                            >
                                Thêm lớp mới
                            </Button>
                        </Box>
                        <Box px={2} pb={2}>
                            <Form form={form} component={false}>
                                <Spin spinning={isLoading}>
                                    <Table<CourseClass>
                                        rowKey={c => c.id}
                                        size="small"
                                        bordered
                                        style={{
                                            borderRadius: 10,
                                            background: "#fff",
                                            marginBottom: 0,
                                        }}
                                        pagination={{
                                            current: query?.Page ?? 1,
                                            pageSize: query?.PageSize ?? 10,
                                            total: data?.data?.data?.totalItems ?? 0,
                                            showSizeChanger: true,
                                        }}
                                        onChange={e => setQuery(prevState => ({
                                            ...prevState,
                                            Page: e?.current ?? 1 - 1,
                                            PageSize: e?.pageSize,
                                        }))}
                                        expandable={{
                                            defaultExpandAllRows: false,
                                            expandedRowRender: (record) =>
                                                childrenCourseClasses?.data?.data?.items?.filter(
                                                    (e) => e?.parentCourseClassCode === record?.courseClassCode
                                                )?.length !== 0 ? (
                                                    <Table<CourseClass>
                                                        columns={childrenColumns}
                                                        rowKey={c => c.id}
                                                        bordered
                                                        pagination={false}
                                                        dataSource={
                                                            childrenCourseClasses?.data?.data?.items?.filter(
                                                                (e) => e?.parentCourseClassCode === record?.courseClassCode
                                                            ) ?? []
                                                        }
                                                        size="small"
                                                        showHeader
                                                        style={{ background: "#f4faff", borderRadius: 8, margin: 0 }}
                                                    />
                                                ) : (
                                                    <Empty
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                        description={<span style={{ color: "#aaa" }}>Không có lớp thành phần</span>}
                                                    />
                                                ),
                                        }}
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
                                        columns={mergedColumns as ColumnType<CourseClass>[]}
                                        dataSource={customDataSource ?? []}
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
                                    />
                                </Spin>
                            </Form>
                        </Box>
                        {/* Modal chi tiết lịch học */}
                        <Modal
                            open={!!showScheduleRecord}
                            onCancel={() => setShowScheduleRecord(null)}
                            footer={null}
                            centered
                            bodyStyle={{ borderRadius: 12, padding: 32, background: "#f6faff" }}
                        >
                            <Typography.Title level={5}>Lịch học của lớp <Tag color="blue">{showScheduleRecord?.courseClassName}</Tag></Typography.Title>
                            <Box mt={2}>
                                {timeLine?.data?.data?.items
                                    ?.filter((c) => c.courseClassCode === showScheduleRecord?.courseClassCode)
                                    ?.map((e) => (
                                        <Card key={e.id} size="small" style={{ marginBottom: 8, borderLeft: "5px solid #1677ff" }}>
                                            <Space>
                                                <Tag color="blue">Phòng {e?.roomCode}</Tag>
                                                <Tag color="purple">Thứ {e?.dayOfWeek + 2}</Tag>
                                                <Tag color="geekblue">Tiết {e?.slots?.join(",")}</Tag>
                                            </Space>
                                        </Card>
                                    ))
                                }
                                {timeLine?.data?.data?.items?.filter((c) => c.courseClassCode === showScheduleRecord?.courseClassCode)?.length === 0 && (
                                    <Empty description="Chưa có lịch học" />
                                )}
                            </Box>
                        </Modal>
                    </Card>
                    {/* RIGHT: Lịch/phòng học */}
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
                        <Box
                            display="flex"
                            alignItems="center"
                            px={3}
                            pt={3}
                            pb={1}
                            style={{
                                borderBottom: "1px solid #f0f0f0",
                                marginBottom: 0,
                            }}
                        >
                            <BookOutlined style={{ marginRight: 10, color: "#1677ff", fontSize: 24 }} />
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                Sắp xếp lịch học & phòng học
                            </Typography.Title>
                        </Box>
                        <Box px={2} py={2} style={{ minHeight: 350 }}>
                            <TableSchedule subject={getSubject} onChange={(scheduleItems) => {
                                console.log(scheduleItems)
                            }} />
                        </Box>
                    </Card>
                </div>
            </Modal>
        </>
    );
};

export default StudySectionCourseClasses;