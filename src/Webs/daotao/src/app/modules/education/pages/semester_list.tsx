import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import { useAppDispatch, useAppSelector } from "@/app/stores/hook";
import {ReactElement, useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box, IconButton} from "@mui/material";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Space, Table, Tooltip} from "antd";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import SemesterModal from "@/app/modules/education/components/semester_modal.tsx";
import {Query} from "@/infrastructure/query.ts";
import {Badge} from "@/app/components/ui/badge.tsx"
import {RoutePaths} from "@/core/route_paths.ts";
import {Eye} from "lucide-react";
import {HistoryItem} from "@/app/components/modals/history_item.tsx";
import { HistoryModal } from "@/app/components/modals/history_modal";
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
        Sorts: ["IdDesc"]
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
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <HistoryModal aggregationId={record.id} aggregateType={"Semester"} />
            ),
        },

    ];

    const tableColumns = columns.map((item) => ({ ...item }));

    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box>
                <Table<Semester>
                    rowKey={(c) => c.id}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                        {/*<Button onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>*/}
                        <SemesterModal refetch={refetch} />
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
            </Box>
        </PredataScreen>
    )
}
export default SemesterList