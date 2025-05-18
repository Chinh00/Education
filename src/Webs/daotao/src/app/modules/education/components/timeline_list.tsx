import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {CourseClass} from "@/domain/course_class.ts";
import CourseClassType from "@/app/modules/education/components/courseClassType.tsx";
import {Badge, Table, Tooltip, Typography} from "antd";
import {Box, IconButton} from "@mui/material";
import {RoutePaths} from "@/core/route_paths.ts";
import {Eye} from "lucide-react";
import {useNavigate} from "react-router";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import Day_of_week from "@/app/modules/education/components/day_of_week.tsx";
import {Student} from "@/domain/student.ts";

export type TimelineListProps = {
    courseClassCode: string
}

const TimelineList = (props: TimelineListProps) => {
    const nav = useNavigate()
    const {data, isLoading, isSuccess} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "==",
                value: props.courseClassCode,
            }
        ]
    }, props.courseClassCode !== "")
    const columns: ColumnsType<SlotTimeline> = [
        {
            title: 'Tên lớp học',
            dataIndex: "courseClassCode",
        },
        {
            title: 'Tòa nhà',
            dataIndex: "buildingCode",
        },
        {
            title: 'Tên lớp',
            dataIndex: "roomCode",
        },
        {
            title: 'Ngày học',
            render: (value, record) => (
                <Day_of_week day={record?.dayOfWeek} />
            )
        },
        {
            title: 'Tiết học',
            render: (value, record) => (
                <Badge>{record?.slots?.join(",")}</Badge>
            )
        },



    ];
    const tableColumns = columns.map((item) => ({ ...item }));



    return (
        <>
            <Table<SlotTimeline>
                rowKey={(c) => c.id}
                loading={isLoading}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={" p-[16px] text-white "}>
                    <Typography.Title level={5}>Lịch học</Typography.Title>
                </Box>}
                size={"small"}
                bordered={true}
                // pagination={{
                //     current: query?.Page ?? 1,
                //     pageSize: query?.PageSize ?? 10,
                //     total: data?.data?.data?.totalItems ?? 0
                // }}
                // onChange={(e) => {
                //     setQuery(prevState => ({
                //         ...prevState,
                //         Page: e?.current ?? 1 - 1,
                //         PageSize: e?.pageSize
                //     }))
                // }}
                columns={tableColumns}
                dataSource={data?.data?.data?.items ?? []}
            />
        </>
    )
}
export default TimelineList;