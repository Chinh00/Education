import React, {useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import {useNavigate} from "react-router";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {ColumnsType, getStageText, useGetDepartments} from "@/app/modules/common/hook.ts";
import {SubjectRegister} from "@/domain/student_register.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import {Avatar, Button, Popconfirm, Select, Space, Table, Tag, Typography} from "antd";
import {Box} from "@mui/material";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {CourseClass} from "@/domain/course_class.ts";
import {ArrowRight} from "lucide-react";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {DeleteOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import Edit_table_schedule from "@/app/modules/education/components/edit_table_schedule.tsx";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import toast from "react-hot-toast";
import RegisterResultClassList from "../components/register_result_class_list.tsx"
const Register_period_result = () => {
    const {currentParentSemester, currentChildSemester} = useAppSelector<CommonState>(c => c.common)
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Kết quả đăng ký học"}));
    }, []);
    const [selectedDepartment, setSelectedDepartment] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")
    
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: currentParentSemester?.semesterCode ?? ""
            }
        ]
    })
    const {data, isPending, isSuccess} = useGetSubjectRegister(query, currentParentSemester?.semesterCode !== undefined)
    const nav = useNavigate();
    const [selectedStage, setSelectedStage] = useState(0);
    const {data: departments} = useGetDepartments({
        Page: 1,
        PageSize: 500
    })
    const getSemesterByStage = (stage: number) => {
        currentChildSemester?.find(e => (+e?.semesterCode?.split('_')[3]) === (stage + 1))
        if (stage === 0 || stage === 2) {
            return currentChildSemester?.find(e => (+e?.semesterCode?.split('_')[3]) === 1)
        }
        if (stage === 1 || stage === 3) {
            return currentChildSemester?.find(e => (+e?.semesterCode?.split('_')[3]) === 2)
        }
        return currentParentSemester
        
    }
    const [subjectQuery, setSubjectQuery] = useState<Query>({
        
    })
    useEffect(() => {
        if (selectedDepartment !== "") {
            setSubjectQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(e => e.field !== "DepartmentCode") ?? [],
                    {
                        field: "DepartmentCode",
                        operator: "==",
                        value: selectedDepartment
                    }
                ]
            }))
        }
    }, [selectedDepartment]);
    const { data: subjects} = useGetSubjects(subjectQuery)
    
    const getSubject = (subjectCode: string) => {
        return subjects?.data?.data?.items?.filter(e => e.subjectCode === subjectCode)[0] ?? undefined
    }
    const [queryCourseClassParent, setQueryCourseClassParent] = useState<Query>({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: currentParentSemester?.semesterCode!
            },

            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
        Includes: ["StudentIds"]
    })
    const {data: courseClassesParent, isLoading, refetch: refetchParent} = useGetCourseClasses(queryCourseClassParent, currentParentSemester?.semesterCode !== undefined && queryCourseClassParent?.Filters?.filter(e => e.field === "SemesterCode") !== undefined && queryCourseClassParent?.Filters?.filter(e => e.field === "Stage") !== undefined && queryCourseClassParent?.Filters?.filter(e => e.field === "SubjectCode") !== undefined);
    useEffect(() => {
        setQueryCourseClassParent(prevState => {
            const prevStageFilter = prevState?.Filters?.find(e => e.field === "Stage");
            const newValue = selectedStage?.toString()
            if (prevStageFilter?.value === newValue) return prevState;
            return {
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(e => e.field !== "Stage") ?? [],
                    {
                        field: "Stage",
                        operator: "In",
                        value: newValue
                    }
                ]
            }
        })
    }, [selectedStage]);

    useEffect(() => {
        if (selectedSubject !== "") {
            setQueryCourseClassParent(prevState => {
                const prevSubjectFilter = prevState?.Filters?.find(e => e.field === "SubjectCode");
                if (prevSubjectFilter?.value === selectedSubject) return prevState;
                return {
                    ...prevState,
                    Filters: [
                        ...prevState?.Filters?.filter(e => e.field !== "SubjectCode") ?? [],
                        {
                            field: "SubjectCode",
                            operator: selectedSubject !== "" ? "==" : "!=",
                            value: selectedSubject
                        }
                    ]
                }
            })
        }
    }, [selectedSubject]);
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
        courseClassesChild !== undefined
    );



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
            render: (_, record) => getSubject(record?.subjectCode)?.numberOfCredits,
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
            render: (text, record) => (
                <Badge
                    variant={"outline"}
                    className={"bg-blue-100 flex flex-col justify-start items-start"}
                >
                    <span>{getStageText(record?.stage ?? 0)}</span>
                    <span>
                        {DateTimeFormat(getSemesterByStage(record?.stage)?.startDate, "DD/MM/YYYY")} -{" "}
                        {DateTimeFormat(getSemesterByStage(record?.stage)?.endDate, "DD/MM/YYYY")}
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
            title: "Số SV đăng ký học",
            width: 50,
            render: (text, record) => record?.studentIds?.length ?? 0,
            
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
            title: "Hành động",
            dataIndex: "action",
            width: 120,
            render: (text, record) => <RegisterResultClassList courseClass={record}/>
        },
    ];
    
    const getChildRows = (parentCode: string) => {
        return (
            courseClassesChild?.data?.data?.items
                ?.filter((e) => e.parentCourseClassCode === parentCode) ?? []
        );
    };
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"min-w-[500px] flex flex-row gap-5"}>
                <Select
                    showSearch
                    className={"min-w-[400px]"}
                    placeholder={"Chọn bộ môn"}
                    onChange={(e) => {
                        setSelectedDepartment(e)
                    }}
                >
                    {departments && departments?.data?.data?.items?.filter(e => e.departmentName?.startsWith("Bộ môn"))?.map((e) => (
                        <Select.Option key={e.departmentCode} value={e.departmentCode}>
                            {e.departmentName} ({e.departmentCode})
                        </Select.Option>
                    ))}
                </Select>
                <Select
                    showSearch
                    className={"min-w-[400px]"}
                    placeholder={"Chọn môn học"}
                    onChange={(e) => {
                        setSelectedSubject(e)
                    }}
                >
                    {subjects && subjects?.data?.data?.items?.map((e) => (
                        <Select.Option key={e.subjectCode} value={e.subjectCode}>
                            {e.subjectCode} ({e.subjectName})
                        </Select.Option>
                    ))}
                </Select>
                
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
            </Box>
            <Table<CourseClass>
                loading={isLoading}
                size={"small"}
                rowKey={e => e.courseClassCode}
                bordered
                pagination={{
                    current: queryCourseClassParent?.Page ?? 1,
                    pageSize: queryCourseClassParent?.PageSize ?? 10,
                    total: courseClassesParent?.data?.data?.totalItems ?? 0
                }}
                onChange={(e) => {
                    setQueryCourseClassParent(prevState => ({
                        ...prevState,
                        Page: e?.current ?? 1 - 1,
                        PageSize: e?.pageSize
                    }))
                }}
                columns={columns}
                
                dataSource={courseClassesParent?.data?.data?.items ?? []}
                rowClassName="editable-row"
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
                                columns={columns}
                                
                                dataSource={childData}
                                rowClassName="editable-row"
                                pagination={false}
                                
                            />
                        );
                    },
                }}
            />
        </PredataScreen>
    )
}
export default Register_period_result;