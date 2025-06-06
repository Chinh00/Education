import {useNavigate, useParams} from "react-router";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {HistoryModal} from "@/app/components/modals/history_modal.tsx";
import {CourseClass} from "@/domain/course_class.ts";
import {Table, Tooltip, Typography} from "antd";
import {Box, Button, IconButton} from "@mui/material";
import {useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {Calendar, History} from "lucide-react"
import { useGetTimeline } from "../../education/hooks/useGetTimeline";

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
            }
        ]
    })
    const {data, isLoading, isSuccess} = useGetCourseClasses(query, semester !== undefined)
    const nav = useNavigate()



    const columns: ColumnsType<CourseClass> = [
        {
            title: 'Mã lớp',
            dataIndex: "courseClassCode",
        },
        {
            title: 'Tên lớp',
            dataIndex: "courseClassName",
        },
        {
            title: "Là lớp thành phần của",
            dataIndex: "parentCourseClassCode",
            render: (_, record) => (
                <>{record?.parentCourseClassCode ? record?.parentCourseClassCode : "Là lớp chính"}</>
            )
        },
        
        {
            title: 'Loại lớp',
            render: (text, record) => (
                <>{ getCourseClassType[record?.courseClassType]}</>
            )
        },
        {
            title: 'Giai đoạn học',
            render: (text, record) => (
                <>{getStage[record.stage]}</>
            )
        },
        {
            title: 'Giảng viên',
            render: (text, record) => (
                <>{record?.teacherName} - ({record?.teacherCode})</>
            )
        },
        
        
        {
            title: 'Lịch học',
            key: 'action',
            render: (_, record) => (
                <div>
                    {timeLine?.data?.data?.items?.filter(c => c.courseClassCode === record?.courseClassCode)?.map(e => {
                        return <div key={e.id}>Phòng {e?.roomCode} Thứ {e?.dayOfWeek + 2}  ( Tiết {e?.slots?.join(",")})</div>
                    })}
                </div>
            ),
        },
        {
            title: 'Lịch sử',
            key: 'action',
            render: (_, record) => (
                <div>
                    <IconButton size={"small"} onClick={() => nav(`/history/CourseClass,SlotTimeline/${record?.id},${timeLine?.data?.data?.items?.filter(c => c.courseClassCode === record?.courseClassCode)?.map(e => e.id)?.join(",")}`)}>
                        <History />
                    </IconButton>
                </div>
            ),
        },
        


    ];
    const tableColumns = columns.map((item) => ({ ...item }));

    const {data: timeLine} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: data?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            },
        ]
    }, data !== undefined && data?.data?.data?.items?.map(c => c.courseClassCode)?.length > 0)
    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess} >
            <Table<CourseClass>
                rowKey={(c) => c.id}
                loading={isLoading}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                    <Typography className={"text-gray-700"}>Danh sách các lớp mở của: {subject}</Typography>
                    <Button size={"small"} onClick={() => nav(`/register/${semester}/subject/${subject}/course-class/create`)}>Tạo mới</Button>
                </Box>}
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
                columns={tableColumns}
                dataSource={data?.data?.data?.items ?? []}

            />
        </PredataScreen>
    )
}
export default CourseClassList;