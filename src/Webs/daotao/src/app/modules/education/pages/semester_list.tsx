import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import { useAppDispatch, useAppSelector } from "@/app/stores/hook";
import {ReactElement, useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box, IconButton} from "@mui/material";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Button, Space, Table, Tooltip} from "antd";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {Query} from "@/infrastructure/query.ts";
import {Badge} from "@/app/components/ui/badge.tsx"
import {RoutePaths} from "@/core/route_paths.ts";
import {Eye} from "lucide-react";
import {HistoryItem} from "@/app/components/modals/history_item.tsx";
import { HistoryModal } from "@/app/components/modals/history_modal";
import {useNavigate} from "react-router";
const labelMap: Record<number, ReactElement> = {
    0: <Badge variant={"destructive"} >Tạo mới</Badge>,
    1: <Badge variant={"secondary"}>Đăng ký học</Badge>,
    2: <Badge variant={"default"}>Hoạt động</Badge>,
    3: <Badge variant={"secondary"}>Kết thúc</Badge>,
};
const SemesterList = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách kì học"}));
    }, []);
    const [query, setQuery] = useState<Query>({
        Sorts: ["IdDesc"],
        Filters: [
            {
                field: "ParentSemesterCode",
                operator: "In",
                value: ","
            }
        ]
    })

    const {data, isLoading, isSuccess, refetch} = useGetSemesters(query)

    const columns: ColumnsType<Semester> = [
        {
            title: 'Mã kì học',
            dataIndex: "semesterCode",
        },
        {
            title: 'Tên kì học',
            dataIndex: "semesterName",
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{DateTimeFormat(record?.startDate)}</div>
            )
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: "registerDate",
            render: (text, record) => (
                <div>{DateTimeFormat(record?.endDate)}</div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: "semesterStatus",
            render: (text, record) => (
                labelMap[Math.floor(record?.semesterStatus ?? 0)]
            )
        },
    ];

    const tableColumns = columns.map((item) => ({ ...item }));
    const nav = useNavigate()
    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box className={"flex flex-col gap-5 justify-start"}>
                <Button type={"primary"} className={"w-min"} onClick={() => nav(RoutePaths.SEMESTER_CREATE)}>Tạo mới</Button>
                <Table<Semester>
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
                    columns={tableColumns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}
export default SemesterList