import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {ColumnsType, useGetEventsStore} from "@/app/modules/common/hook.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Subject} from "@/domain/subject.ts";
import {EventHistory} from "@/domain/event_history.ts";
import {Button, Table} from "antd";
import {RotateCcw} from "lucide-react";
import {DateTimeFormat} from "@/infrastructure/date.ts";


const HistoryRecord = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Lịch sử thay đổi"}));
    }, []);
    const {aggregateType, aggregateId} = useParams()
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "AggregateId",
                operator: "In",
                value: aggregateId?.split("-")?.join(",")!
            },
            {
                field: "AggregateType",
                operator: "In",
                value: aggregateType?.split("-").join(",")!
            },

        ],
        Sorts: ["CreatedAtDesc"],
        Page: 1,
        PageSize: 5
    })
    const columns: ColumnsType<EventHistory> = [
        {
            title: 'Thời gian',
            render: (text, record) => (
                DateTimeFormat(record?.createdAt)
            )
        },
        {
            title: 'Người dùng',
            dataIndex: "performedByName",
        },
        {
            title: 'Hành động',
            dataIndex: "eventName",
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));

    const {data, isLoading, isSuccess} = useGetEventsStore(query, aggregateType !== "" && aggregateId !== "")

    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess} >
            <Box>
                <Table<EventHistory>
                    rowKey={(c) => c?.createdAt}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-end items-center p-[16px] text-white "}>
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
export default HistoryRecord