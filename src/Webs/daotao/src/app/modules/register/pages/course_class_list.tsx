import {useNavigate, useParams} from "react-router";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {HistoryModal} from "@/app/components/modals/history_modal.tsx";
import {CourseClass} from "@/domain/course_class.ts";
import {Table, Tooltip, Typography} from "antd";
import {Button} from "antd";
import {useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {Calendar, History} from "lucide-react"
import { useGetTimeline } from "../../education/hooks/useGetTimeline";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {ArrowRight} from "lucide-react"
export const getStage: Record<number, string> =  {
    0: "Giai đoạn 1",
    1: "Giai đoạn 2",
    2: "Cả 2 giai đoạn",
    
}
export const getCourseClassType: Record<number, string> = {
    0: "Lý thuyết",
    1: "Thực hành",
}



const CourseClassList = () => {
    const {subject, semester} = useParams()
    const {data: semesters} = useGetSemesters({
        Filters: [
            {
                field: "SemesterCode",
                operator: "Contains",
                value: semester!
            }
        ]
    }, semester !== undefined && semester !== null && semester !== "");
    
    

    const getSemester = (stage: number) => semesters?.data?.data?.items?.find(e => +e?.semesterCode?.split("_")[3] === (stage + 1)) ?? undefined;
    const {data: subjects} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject!
            }
        ]
    }, subject !== undefined)
    const getSubject = subjects?.data?.data?.items?.[0]
    
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: subject!
            },
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            },
            {
                field: "ParentCourseClassCode",
                operator: "==",
                value: ""
            },
            
        ]
    })
    const {data, isLoading, isSuccess} = useGetCourseClasses(query, semester !== undefined)
    const nav = useNavigate()



    const columns: ColumnsType<CourseClass> = [
        
        {
            title: 'Tên lớp',
            dataIndex: "courseClassName",
            width: 451.5,
            render: (_, record) => (
                <div className={"flex flex-col"}>
                    <span className={"font-bold"}>
                        Lớp chính: 
                        <span className={"font-normal"}> {record?.courseClassName} </span>
                    </span>
                    
                    <span className={"font-bold"}>({getSubject?.subjectName})</span>
                </div>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: "courseClassName",
            width: 200,
            render: (_, record) => (
                <div className={"flex flex-row items-center gap-1 justify-start"}>
                    {DateTimeFormat(getSemester(record?.stage)?.startDate, "DD/MM/YYYY")}
                    <ArrowRight size={18}/>
                    {DateTimeFormat(getSemester(record?.stage)?.startDate, "DD/MM/YYYY")}
                </div>
            )
        },
        {
            title: 'Lịch học',
            key: 'action',
            width: 251.5,
            render: (_, record) => (
                <div>
                    {timeLine?.data?.data?.items?.filter(c => c.courseClassCode === record?.courseClassCode)?.map(e => {
                        return <div key={e.id}>Phòng {e?.roomCode} Thứ {e?.dayOfWeek + 2}  ( Tiết {e?.slots?.join(",")})</div>
                    })}
                </div>
            ),
        },
        {
            title: 'Giảng viên',
            render: (text, record) => (
                <>{record?.teacherName}</>
            )
        },
    ];

    const {data: timeLine} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: data?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            },
        ]
    }, data !== undefined && data?.data?.data?.items?.map(c => c.courseClassCode)?.length > 0)

    const {data: childrenCourseClasses} = useGetCourseClasses({
        Filters: [
            {
                field: "ParentCourseClassCode",
                operator: "In",
                value: data?.data?.data?.items?.map(e => e.courseClassCode)?.join(",")!
            },
        ]
    }, data !== undefined && data?.data?.data?.items?.length > 0)
        
    const childrenColumns: ColumnsType<CourseClass> = [

        {
            title: <span className={"font-bold text-cyan-700"}>Các lớp thành phần</span>,
            dataIndex: "courseClassName",
            width: 450,
            render: (_, record) => (
                <div className={"flex flex-col pl-10"}>
                    <span className={"font-normal"}> {record?.courseClassName} </span>

                    <span className={"font-bold"}>({getSubject?.subjectName})</span>
                </div>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: "courseClassName",
            width: 200,
            render: (_, record) => (
                <div className={"flex flex-row items-center gap-1 justify-start"}>
                    {DateTimeFormat(getSemester(record?.stage)?.startDate, "DD/MM/YYYY")}
                    <ArrowRight size={18}/>
                    {DateTimeFormat(getSemester(record?.stage)?.startDate, "DD/MM/YYYY")}
                </div>
            )
        },
        {
            title: 'Lịch học',
            key: 'action',
            width: 250,
            render: (_, record) => (
                <div>
                    {childrenTimeLine?.data?.data?.items?.filter(c => c.courseClassCode === record?.courseClassCode)?.map(e => {
                        return <div key={e.id}>Phòng {e?.roomCode} Thứ {e?.dayOfWeek + 2}  ( Tiết {e?.slots?.join(",")})</div>
                    })}
                </div>
            ),
        },
        {
            title: 'Giảng viên',
            render: (text, record) => (
                <>{record?.teacherCode ? record?.teacherName : "Chưa xếp giáo viên"}</>
            )
        },
    ];

    const {data: childrenTimeLine} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: childrenCourseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            },
        ]
    }, childrenCourseClasses !== undefined && childrenCourseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.length > 0)
    
    
    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess} >
            <div className={"space-y-5"}>
                <Button type={"primary"} size={"middle"} onClick={() => nav(`/register/${semester}/subject/${subject}/course-class/create`)}>Tạo mới lớp học phần</Button>
                <Table<CourseClass>
                    rowKey={(c) => c.id}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    size={"small"}
                    bordered={true}
                    pagination={{
                        current: query?.Page ?? 1,
                        pageSize: query?.PageSize ?? 10,
                        total: data?.data?.data?.totalItems ?? 0
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
                        expandRowByClick: true,
                        expandedRowRender: (record) => childrenCourseClasses?.data?.data?.items?.filter(e => e?.parentCourseClassCode === record?.courseClassCode)?.length !== 0 ? (
                            <>
                                <Table<CourseClass>
                                    columns={childrenColumns}
                                    rowKey={c => c.id}
                                    bordered={true}
                                    pagination={false}

                                    dataSource={childrenCourseClasses?.data?.data?.items?.filter(e => e?.parentCourseClassCode === record?.courseClassCode) ?? []}
                                />
                            </>
                        ) : <Typography className={"text-center"}>Là lớp chính</Typography>
                    }}
                    columns={columns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </div>
        </PredataScreen>
    )
}
export default CourseClassList;