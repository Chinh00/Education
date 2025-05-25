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
import {Calendar} from "lucide-react"
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
    const {data, isLoading, isSuccess} = useGetCourseClasses(query)
    const nav = useNavigate()
    const columns: ColumnsType<CourseClass> = [
        {
            title: 'Số thứ tự lớp',
            dataIndex: "classIndex",
        },
        {
            title: 'Mã lớp',
            dataIndex: "courseClassCode",
        },
        {
            title: 'Tên lớp',
            dataIndex: "courseClassName",
        },
        {
            title: 'Loại lớp',
            dataIndex: "courseClassType",
        },


        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Tooltip title={"Chi tiết"}>
                    <IconButton size={"small"} onClick={() => nav(`/register/state/${semester}/timeline/${subject}/class/${record?.courseClassCode}`)}><Calendar size={18}/> </IconButton>
                </Tooltip>
            ),
        },

    ];
    const tableColumns = columns.map((item) => ({ ...item }));


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
                    <Button size={"small"} onClick={() => nav(`/register/state/${semester}/timeline/${subject}/class/create`)}>Tạo mới</Button>
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