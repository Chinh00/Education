import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useMemo, useState} from "react";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import loadable from "@loadable/component";
import {setFilters, StudentState} from "@/app/modules/student/stores/student_slice.ts";
import {Badge, GetProp, Table, TableProps} from "antd";
import DepartmentSearch from "@/app/modules/student/components/department_search.tsx";
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";
import {Query} from "@/infrastructure/query.ts";
import BranchSearch from "@/app/modules/student/components/branch_search.tsx";
import {useGetClasses} from "@/app/modules/class/hooks/useGetClasses.ts";
import ClassSearch from "@/app/modules/student/components/class_search.tsx";
import EducationSearch from "@/app/modules/student/components/education_search.tsx";
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
        render: (_, record) => (
            <>
                {record?.informationBySchool?.educationCodes?.map((c, index) => {
                    return <Badge key={index}>{c}</Badge>
                })}
            </>
        ),
    },

];



const StudentList = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách sinh viên"}));
    }, []);

    const {filters} = useAppSelector<StudentState>(c => c.student)


    const tableColumns = columns.map((item) => ({ ...item }));


    const [query, setQuery] = useState<Query>({
        Includes: ["InformationBySchool", "PersonalInformation"]
    })


    useEffect(() => {
        if (filters?.classCode !== undefined)
        setQuery(prevState => ({
            ...prevState,
            Filters: [
                ...prevState?.Filters?.filter(c => c.field !== "InformationBySchool.StudentClassCode") ?? [],
                {
                    field: "InformationBySchool.StudentClassCode",
                    operator: "Contains",
                    value: filters?.classCode!
                }
            ]
        }))
    }, [filters?.classCode]);

    useEffect(() => {
        if (filters?.courseCode) {}
    }, [filters?.courseCode]);

    const {data, isSuccess, isPending} = useGetStudents(query)





    return (
        <>
            <Box className={"flex gap-5 flex-wrap py-10"}>
                <CourseSearch />
                <DepartmentSearch />
                <BranchSearch />
                <EducationSearch />
                <ClassSearch />
            </Box>
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