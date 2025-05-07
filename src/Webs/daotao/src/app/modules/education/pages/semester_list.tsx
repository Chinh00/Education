import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {CommonState, setGroupFuncName } from "@/app/stores/common_slice";
import { useAppDispatch, useAppSelector } from "@/app/stores/hook";
import {useEffect} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {StudentRegister} from "@/domain/student_register.ts";
import dayjs from "dayjs";
import {Space, Table} from "antd";
import {Link} from "react-router";
import {EyeIcon} from "lucide-react";
import {Semester} from "@/domain/semester.ts";
import {DateTimeFormat} from "@/infrastructure/date.ts";
import SemesterModal from "@/app/modules/education/components/semester_modal.tsx";

const SemesterList = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách kì học"}));
    }, []);
    const {data, isLoading, isSuccess, refetch} = useGetSemesters({})

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
                    // rowSelection={{
                    //     // onChange: (selectedRowKeys, selectedRows) => {
                    //     //     setDataAdd(prevState => [...selectedRows])
                    //     // },
                    // }}
                    bordered={true}
                    // pagination={true}
                    columns={tableColumns}
                    dataSource={data?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}
export default SemesterList