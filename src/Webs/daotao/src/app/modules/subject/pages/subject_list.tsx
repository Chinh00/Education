import {ColumnsType} from "@/app/modules/common/hook.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box, IconButton} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import {Subject} from "@/domain/subject.ts";
import {Button, Form, Table, Input, Tooltip } from "antd";
import {Query} from "@/infrastructure/query.ts";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import {useForm} from "react-hook-form";
import { RefreshCw, RotateCcw, Eye } from "lucide-react";
import {useNavigate} from "react-router";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";

const SubjectList = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách môn học"}));
    }, []);
    const nav = useNavigate();
    const columns: ColumnsType<Subject> = [
        {
            title: 'Tên môn học',
            dataIndex: "subjectName",
        },
        {
            title: 'Mã môn học',
            dataIndex: "subjectCode",
        },
        {
            title: 'Tên tiếng anh',
            dataIndex: "subjectNameEng",
        },
        {
            title: 'Số tín chỉ',
            dataIndex: "numberOfCredits",
        },
        {
            title: 'Mã khoa quản lý',
            dataIndex: "departmentCode",
        },
        {
            title: 'Là môn tính điểm',
            dataIndex: "isCalculateMark",
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Chi tiết">
                    <IconButton onClick={() => nav(`/subjects/${record?.subjectCode}`)}><Eye size={15} /></IconButton>
                </Tooltip>
            ),
        },

    ];
    const tableColumns = columns.map((item) => ({ ...item }));

    const [query, setQuery] = useState<Query>({
        Includes: ["DepartmentCode", "NumberOfCredits"]
    })
    
    const {data, isLoading, isSuccess} = useGetSubjects(query)

    return (
        <PredataScreen isLoading={false} isSuccess={true} >
            <Box className={"flex flex-col gap-5 min-h-screen"}>
                <Input.Search loading={isLoading} size={"large"} onSearch={e => {
                    setQuery(prevState => ({
                        ...prevState,
                        Filters: [
                            {
                                field: "SubjectName",
                                operator: "Contains",
                                value: e
                            }
                        ],
                        Page: 1
                    }))
                }} />
                <Table<Subject>
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
                    columns={tableColumns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}
export default SubjectList