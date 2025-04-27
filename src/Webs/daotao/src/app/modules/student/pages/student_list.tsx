import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useMemo, useState} from "react";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import loadable from "@loadable/component";
import {setQuery, StudentState} from "@/app/modules/student/stores/student_slice.ts";
import {GetProp, Table, TableProps} from "antd";
import DepartmentSearch from "@/app/modules/student/components/department_search.tsx";
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";
import {Query} from "@/infrastructure/query.ts";
import BranchSearch from "@/app/modules/student/components/branch_search.tsx";
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
const CourseSearch = loadable(() => import('../components/course_search.tsx'), {
    fallback: <div>Loading...</div>,
})
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
    },

];



const StudentList = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách sinh viên"}));
    }, []);

    const {query, educationQuery} = useAppSelector<StudentState>(c => c.student)

    const {data, isSuccess, isPending} = useGetStudents(query)



    const tableColumns = columns.map((item) => ({ ...item }));
    const {data: educations} = useGetEducations(educationQuery, educationQuery?.Filters?.filter(c => c.field !== "CourseCode") !== undefined)
    useEffect(() => {
        if (!!educations?.data?.data?.items) {
            dispatch(setQuery({
                ...query,
                Filters: [
                    ...query?.Filters?.filter(c => c.field != "InformationBySchool.EducationCodes") ?? [],
                    {
                        field: 'InformationBySchool.EducationCodes',
                        operator: "ArrayContains",
                        value: educations?.data?.data?.items?.map(c => c.code).join(",")!
                    }
                ]
            }))
        }
    }, [educations]);



    return (
        <>
            <CourseSearch />
            <DepartmentSearch />
            <BranchSearch />
            <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
                <Box >
                    <Table<Student>
                        rowKey={(c) => c.id}
                        loading={isPending}
                        style={{
                            height: "500px",
                        }}
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>

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
        </>
    )
}
export default StudentList