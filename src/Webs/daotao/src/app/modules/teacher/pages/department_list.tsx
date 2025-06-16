import {ColumnsType, useGetDepartments} from "@/app/modules/common/hook.ts";
import {useCallback, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Subject} from "@/domain/subject.ts";
import CourseClassAssignTeacherModal from "@/app/modules/teacher/components/course_class_assign_teacher_modal.tsx";
import {Department} from "@/domain/department.ts";
import {Input, Table} from "antd";
import {Box} from "@mui/material";
import {debounce} from "lodash";
import {Query} from "@/infrastructure/query.ts";

const Department_list = () => {
    const [query, setQuery] = useState<Query>({
        
    })
    const {data: departments, isLoading } = useGetDepartments(query)
    const columns: ColumnsType<Department> = [

        {
            title: 'Mã bộ môn',
            dataIndex: "departmentCode",
        },
        {
            title: 'Tên bộ môn',
            dataIndex: "departmentName",
        },
        
    ];
    const [searchKeyword, setSearchKeyword] = useState("")
    const searchTeacher = useCallback(
        debounce((keyword) => {
            setQuery({
                ...query,
                Filters: [
                    {
                        field: "SubjectName",
                        operator: keyword !== "" ? "Contains" : "!=",
                        value: keyword !== "" ? keyword : "-1"
                    },
                ]
            });
        }, 1200),
        [query]
    );
    return (
        <PredataScreen isSuccess={true} isLoading={false}>
            <Box className={"flex flex-col gap-5"}>
                <Input.Search value={searchKeyword} size={"large"} placeholder={"Tìm theo tên môn học"}
                              onChange={e => {
                                  setSearchKeyword(e.target.value);
                                  searchTeacher(e.target.value);
                              }}
                />
                <Table<Department>
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
                        total: departments?.data?.data?.totalItems ?? 0
                    }}
                    onChange={(e) => {
                        setQuery(prevState => ({
                            ...prevState,
                            Page: e?.current ?? 1 - 1,
                            PageSize: e?.pageSize
                        }))
                    }}
                    columns={columns}
                    dataSource={departments?.data?.data?.items ?? []}
                />
            </Box>   
        </PredataScreen>
    )
}
export default Department_list;