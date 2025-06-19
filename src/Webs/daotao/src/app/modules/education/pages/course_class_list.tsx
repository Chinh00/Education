import React, {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box } from "@mui/material";
import { useGetCourseClasses } from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import { Query } from "@/infrastructure/query.ts";
import { useParams } from "react-router";
import {
    Button,
    Modal,
    InputNumber,
    Form,
    Typography,
    Space,
    Avatar,
    Tag,
    Table,
    Input,
    Popconfirm,
} from "antd";
import { useGenerateCourseClasses } from "@/app/modules/education/hooks/useGenerateCourseClasses.ts";
import { useAppSelector } from "@/app/stores/hook.ts";
import { CommonState } from "@/app/stores/common_slice.ts";
import { ColumnsType, getStageText } from "@/app/modules/common/hook.ts";
import { CourseClass } from "@/domain/course_class.ts";
import { Badge } from "@/app/components/ui/badge.tsx";
import { DateTimeFormat } from "@/infrastructure/date.ts";
import { UserOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useGetSubjects } from "@/app/modules/subject/hooks/hook.ts";
import { useRemoveCourseClass } from "@/app/modules/education/hooks/useRemoveCourseClass.ts";
import toast from "react-hot-toast";

// ----- Editable Column Type (fix TS error for editable prop) -----
import type { ColumnType } from "antd/es/table";
import {useUpdateCourseClass} from "@/app/modules/education/hooks/useUpdateCourseClass.ts";
import {setQuery} from "@/app/modules/education/stores/education_slice.ts";
import {useGenerateSchedule} from "@/app/modules/education/hooks/useGenerateSchedule.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {ArrowRight} from "lucide-react";
import Edit_table_schedule from "@/app/modules/education/components/edit_table_schedule.tsx";
interface EditableColumnType<T> extends ColumnType<T> {
    editable?: boolean;
}

// Editable Cell Component
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "number" | "text";
    record: CourseClass;
    index: number;
    children: React.ReactNode;
}
const EditableCell: React.FC<EditableCellProps> = ({
                                                       editing,
                                                       dataIndex,
                                                       title,
                                                       inputType,
                                                       children,
                                                       ...restProps
                                                   }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: false,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Course_class_list = () => {
    const { subjectCode } = useParams();
    const [selectedStage, setSelectedStage] = useState(0);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string>("");
    const [rowSelection, setRowSelection] = useState<React.Key[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [totalTheoryCourseClass, setTotalTheoryCourseClass] = useState(0);

    const [query, setQuery] = useState<Query>({
        Filters: [
            { field: "SubjectCode", operator: "==", value: subjectCode! },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
        Page: 1,
        PageSize: 1000,
    });
    useEffect(() => {
        setQuery(pre => ({
            ...pre,
            Filters: [
                ...pre?.Filters?.filter(e => e.field !== "Stage") ?? [],
                { field: "Stage", operator: "==", value: `${selectedStage}` },
            ]
        }))
    }, [selectedStage]);
    const { data: courseClassesParent, isLoading, refetch: refetchParent } = useGetCourseClasses(
        query,
        subjectCode !== undefined && query?.Filters?.find(e => e.field === "Stage") !== undefined
    );

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

    const { currentParentSemester } = useAppSelector<CommonState>(
        (e) => e.common
    );
    const { mutate, isPending } = useGenerateCourseClasses();

    const { data: subjects } = useGetSubjects(
        { Filters: [{ field: "SubjectCode", operator: "==", value: subjectCode! }] },
        subjectCode !== undefined && subjectCode !== ""
    );
    const getSubject = subjects?.data?.data?.items?.[0];

    // Utility: get all child row ids and codes by parent code
    const getChildRows = (parentCode: string) => {
        return (
            courseClassesChild?.data?.data?.items
                ?.filter((e) => e.parentCourseClassCode === parentCode) ?? []
        );
    };

    // Prepare parent data for Table, ensure key = id
    const parentData: CourseClass[] =
        courseClassesParent?.data?.data?.items?.map((item: CourseClass) => ({
            ...item,
            key: item.id,
        })) ?? [];

    // Editable logic
    const isEditing = (record: CourseClass) => record.id === editingId;

    const edit = (record: CourseClass) => {
        form.setFieldsValue({ ...record });
        setEditingId(record.id);
    };

    const cancel = () => setEditingId("");
    const {mutate: updateMutate, reset: updateReset} = useUpdateCourseClass()
    const {mutate: generateSchedule, reset: generateScheduleReset} = useGenerateSchedule()
    const save = async (courseClassCode: string) => {
        try {
            const row = (await form.validateFields()) as CourseClass;
            // Call your update API here if needed!
            setEditingId("");
            updateMutate({
                courseClassCode: courseClassCode,
                courseClassName: row?.courseClassName,
                weekStart: row?.weekStart,
                numberStudentsExpected: row?.numberStudentsExpected,
            }, {
                onSuccess: () => {
                    toast.success("Cập nhật lớp học phần thành công!");
                    refetchParent();
                    refetchChild();
                    updateReset();
                },
                onError: (error) => {
                    toast.error(`Cập nhật lớp học phần thất bại: ${error}`);
                }
            })
            
        } catch (errInfo) {
            // handle error
        }
    };

    const { mutate: removeMutate, reset: removeReset } = useRemoveCourseClass();

    // Xóa lớp học phần, nếu là lớp cha thì xóa cả các lớp con
    const deleteCourseClass = async (courseClassCode: string, isParent: boolean, parentCode?: string) => {
        if (isParent) {
            const childRows = getChildRows(parentCode!);
            childRows.map((child) =>
                removeMutate(child.courseClassCode, {
                    
                })
            );
            removeMutate(courseClassCode, {
                onSuccess: () => {
                    toast.success("Đã xóa lớp học phần cha và các lớp con thành công!");
                    refetchParent();
                    refetchChild();
                    removeReset()
                },
                onError: (error) => {
                    toast.error(`Xóa lớp học phần cha thất bại: ${error}`);
                }
            });
        } else {
            removeMutate(courseClassCode, {
                onSuccess: () => {
                    toast.success("Xóa lớp học phần thành công!");
                    refetchParent();
                    refetchChild();
                },
                onError: (error) => {
                    toast.error(`Xóa lớp học phần thất bại: ${error}`);
                }
            });
        }
    };
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
        subjectCode !== undefined &&
        courseClassesChild !== undefined
    );
    const getSiblingRows = (parentCode: string) =>
        courseClassesChild?.data?.data?.items
            ?.filter(e => e.parentCourseClassCode === parentCode) ?? [];
    const getParentRow = (parentCode: string) =>
        courseClassesParent?.data?.data?.items?.find(e => e.courseClassCode === parentCode);
    
    

    // Table columns (now with EditableColumnType)
    const columns: EditableColumnType<CourseClass>[] = [
        {
            title: "Tên lớp",
            dataIndex: "courseClassName",
            width: "15%",
            className: "text-[12px]",
            editable: true,
        },
        {
            title: "Số TC",
            className: "text-[12px]",
            width: "5%",
            render: () => getSubject?.numberOfCredits,
        },
        {
            title: "Lịch học",
            className: "text-[12px]",
            width: 250,
            render: (text, record) => {
                return  <div className={"flex flex-col gap-1 justify-start items-start"}>
                    {timeLines?.data?.data?.items?.filter(e => e?.courseClassCode === record?.courseClassCode)?.map(e => (
                        <div key={e.id} className={"flex flex-row flex-nowrap gap-1"}>
                            <span  className={"font-bold text-gray-500"}>Từ tuần: {e?.startWeek } {"->"} {e?.endWeek}</span>
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
            editable: true,
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
        {
            title: "Tác vụ",
            dataIndex: "operation",
            width: 120,
            render: (_: any, record: CourseClass) => {
                const editable = isEditing(record);
                const isParent = !record.parentCourseClassCode;

                
                let listCourseClassesRelative: string[] = [];
                if (isParent) {
                    listCourseClassesRelative = [
                        record.courseClassCode,
                        ...getChildRows(record.courseClassCode).map(c => c.courseClassCode)
                    ];
                } else {
                    // row con: lấy cha + tất cả các con cùng cha
                    listCourseClassesRelative = [
                        record.parentCourseClassCode!,
                        ...getChildRows(record.parentCourseClassCode!).map(c => c.courseClassCode)
                    ];
                }
                return (
                    <div>
                        <span>
                        {editable ? (
                            <>
                                <Typography.Link
                                    onClick={() => save(record?.courseClassCode)}
                                    style={{ marginRight: 8 }}
                                >
                                    Lưu
                                </Typography.Link>
                                <Popconfirm title="Hủy thay đổi?" onConfirm={cancel}>
                                    <a>Hủy</a>
                                </Popconfirm>
                            </>
                        ) : (
                            <>
                                <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    style={{ marginLeft: 4 }}
                                    disabled={editingId !== ""}
                                    onClick={() => edit(record)}
                                />
                                <Popconfirm
                                    title={
                                        isParent
                                            ? "Bạn có chắc muốn xóa LỚP CHA này và tất cả lớp con?"
                                            : "Bạn có chắc muốn xóa lớp học phần này?"
                                    }
                                    onConfirm={() =>
                                        deleteCourseClass(
                                            record.courseClassCode,
                                            isParent,
                                            record.courseClassCode
                                        )
                                    }
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        danger
                                        style={{ marginLeft: 4 }}
                                    />
                                </Popconfirm>
                            </>
                        )}
                    </span>
                        <Edit_table_schedule
                            listCourseClassesRelative={listCourseClassesRelative}
                            courseClass={record}
                            subjectCode={record?.subjectCode}
                        />
                    </div>
                );
            },
        },
    ];

    // Merge columns for editable cells
    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record: CourseClass) => ({
                record,
                inputType:
                    col.dataIndex === "weekStart" ||
                    col.dataIndex === "numberStudentsExpected"
                        ? "number"
                        : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    

    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <div className={"flex gap-2 mb-3"}>
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
                <div className={"flex gap-3"}>
                    <Button onClick={() => setOpenModal(true)}>
                        Thêm lớp học phần tự động
                    </Button>
                    <Modal
                        open={openModal}
                        onCancel={() => setOpenModal(false)}
                        loading={isPending}
                        onOk={() => {
                            mutate({
                                semesterCode: currentParentSemester?.semesterCode!,
                                subjectCode: subjectCode!,
                                stage: selectedStage,
                                totalTheoryCourseClass: totalTheoryCourseClass,
                            }, {
                                onSuccess: () => {
                                    toast.success("Tạo lớp học phần thành công!");
                                    setOpenModal(false);
                                    setTotalTheoryCourseClass(0);
                                    refetchParent();
                                    refetchChild();
                                },
                                onError: (error) => {
                                    toast.error(`Tạo lớp học phần thất bại: ${error}`);
                                }
                            });
                        }}
                    >
                        <Box className={"p-5"}>
                            <Form>
                                <Typography.Title level={4} className={"text-center"}>
                                    Xác nhận tạo lớp học
                                </Typography.Title>
                                <Form.Item label={"Số lượng lớp cần tạo"}>
                                    <InputNumber
                                        value={totalTheoryCourseClass}
                                        onChange={(value) => setTotalTheoryCourseClass(value!)}
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder={"Nhập số lớp cần tạo"}
                                        className={"w-full"}
                                    />
                                </Form.Item>
                            </Form>
                        </Box>
                    </Modal>
                    <Button>Thêm lớp học thủ công</Button>
                </div>
                <div className={"flex gap-3 py-2"}>
                    <Button disabled={rowSelection?.length === 0} onClick={() => {
                        generateSchedule({
                            semesterCode: currentParentSemester?.semesterCode!,
                            subjectCode: subjectCode!,
                            courseClassCodes: rowSelection as string[],
                        }, {
                            onSuccess: () => {
                                toast.success("Xếp thời khóa biểu thành công!");
                                setRowSelection([]);
                                refetchParent();
                                refetchChild();
                                generateScheduleReset();
                                timelineRefetch()
                            },
                            onError: (error) => {
                                toast.error(`Xếp thời khóa biểu thất bại: ${error}`);
                            }
                        })
                    }}>
                        Xếp thời khóa biểu tự động
                    </Button>
                    
                </div>
                <Box>
                    <Typography.Title level={3} className={"text-center"}>
                        Danh sách lớp
                    </Typography.Title>
                    <Form form={form} component={false}>
                        <Table<CourseClass>
                            loading={isLoading}
                            size={"small"}
                            rowKey={e => e.courseClassCode}
                            bordered
                            columns={mergedColumns as ColumnsType<CourseClass>}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            dataSource={parentData}
                            rowClassName="editable-row"
                            pagination={false}
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
                            expandable={{
                                defaultExpandAllRows: true,
                                columnWidth: "2%",
                                expandedRowRender: (record) => {
                                    // Bảng con (nếu muốn edit cell cũng làm logic tương tự như bảng cha)
                                    const childData = getChildRows(record.courseClassCode);
                                    return (
                                        <Table<CourseClass>
                                            size="small"
                                            rowKey={e => e.courseClassCode}

                                            bordered
                                            columns={mergedColumns as ColumnsType<CourseClass>}
                                            components={{
                                                body: {
                                                    cell: EditableCell,
                                                },
                                            }}
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
                        />
                    </Form>
                </Box>
            </Box>
        </PredataScreen>
    );
};
export default Course_class_list;