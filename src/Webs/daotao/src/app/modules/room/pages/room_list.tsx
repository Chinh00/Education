import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box, IconButton} from "@mui/material";
import {ColumnsType, useGetRooms} from "@/app/modules/common/hook.ts";
import {useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {Button, Checkbox, Input, Table, Tooltip} from "antd";
import {Subject} from "@/domain/subject.ts";
import {Badge} from "@/app/components/ui/badge.tsx";
import {Eye} from "lucide-react";
import {Room} from "@/domain/room.ts";
import { FieldTimeOutlined} from "@ant-design/icons"
import Room_timeline from "@/app/modules/room/components/room_timeline.tsx";

const Room_list = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách phòng học"}));
    }, []);
    const [query, setQuery] = useState<Query>({
        
    })
    const {data, isLoading, isSuccess} = useGetRooms(query);
    const columns: ColumnsType<Room> = [
        {
            title: 'Tên phòng ',
            dataIndex: "name",
        },
        {
            title: 'Mã phòng',
            dataIndex: "code",
        },
        {
            title: 'Tòa nhà',
            dataIndex: "buildingCode",
        },
        {
            title: 'Sức chứa',
            dataIndex: "capacity",
        },
        {
            title: 'Điều kiện phòng',
            render: (text, record) => (
                <div className={"flex gap-1"}>
                    {record?.supportedConditions?.map((e, index) => <Badge key={index}>{e}</Badge>)}
                </div>
            )
        },
        {
            title: 'Hành động',
            render: (text, record) => (
                <Room_timeline room={record} />
            )
        },
        
        
        

    ];
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"flex flex-col gap-2"}>
                <Input.Search placeholder={"Tìm kiếm tên phòng "} loading={isLoading} onSearch={e => {
                    setQuery(prevState => ({
                        ...prevState,
                        Filters: [
                            {
                                field: "Name",
                                operator: "Contains",
                                value: e
                            }
                        ],
                        Page: 1
                    }))
                }} />
                <Table<Room>
                    rowKey={(c) => c.id}
                    loading={isLoading}
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
                    columns={columns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default Room_list