import {Query} from "@/infrastructure/query.ts";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Badge, Button, Card, Table, Typography} from "antd";
import {Student} from "@/domain/student.ts";
import {Box} from "@mui/material";
import {RotateCcw} from "lucide-react";
import { ColumnsType } from "../../common/hook";

export type StudentListProps = {
    query: Query
}
const StudentList = (props: StudentListProps) => {
    const { data, isLoading, isSuccess} = useGetStudents(props.query);
    const columns: ColumnsType<Student> = [
        {
            title: 'Tên sinh viên',
            dataIndex: ["personalInformation", "fullName"],
        },
        {
            title: 'Mã sinh viên',
            dataIndex: ["informationBySchool", "studentCode"],
        },
        {
            title: 'Số điện thoại',
            dataIndex: ["personalInformation", "phoneNumber"],
        },
        {
            title: 'Chương trình đào tạo',
            dataIndex: ["personalInformation", "educationCodes"],
            render: (_, record) => (
                <>
                    {record?.educationPrograms?.map((c, index) => {
                        return <Badge key={index}>{c?.name}</Badge>
                    })}
                </>
            ),
        },

    ];
    const tableColumns = columns.map((item) => ({ ...item }));



    return (
        <>
            <Table<Student>
                rowKey={(c) => c.id}
                loading={isLoading}
                style={{
                    height: "500px",
                }}
                showHeader={true}
                title={() => <Box className={" p-[16px] text-white "}>
                    <Typography.Title level={5}>Danh sách sinh viên trong lớp</Typography.Title>
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
export default StudentList