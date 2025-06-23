import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useMemo, useState} from "react";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import loadable from "@loadable/component";
import {StudentState} from "@/app/modules/student/stores/student_slice.ts";
import {Badge, Button, Form, GetProp, Table, TableProps} from "antd";
import {Query} from "@/infrastructure/query.ts";
import {useForm} from "react-hook-form";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import {RotateCcw} from "lucide-react";
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;

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



const StudentList = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách sinh viên"}));
    }, []);
    const [pagination, setPagination] = useState()

    const {studentListSelected} = useAppSelector<StudentState>(c => c.student)


    const tableColumns = columns.map((item) => ({ ...item }));


    const [query, setQuery] = useState<Query>({
        Includes: ["InformationBySchool", "PersonalInformation", "EducationPrograms"]
    })


    useEffect(() => {
        if (studentListSelected?.classCode !== undefined) {
            setQuery(prevState => ({
                ...prevState,
                Filters: [
                    {
                        field: "InformationBySchool.StudentClassCode",
                        operator: "==",
                        value: studentListSelected?.classCode!
                    }
                ]
            }))
        }
    }, [studentListSelected?.classCode]);

    const {data, isSuccess, isPending} = useGetStudents(query)


    const {control, reset, getValues} = useForm<{input: string}>({
        defaultValues: {
            input: ""
        }
    })


    useEffect(() => {
        return () => {
            reset()
        }
    }, []);

    return (
        <>

            <PredataScreen isLoading={false} isSuccess={true} >
                <Form className={"flex gap-2"} >
                    <FormInputAntd className={"w-full"} control={control} name={"input"} placeholder={"Nhập mã sinh viên"} initialValue={""} />
                    <Button type={"primary"} onClick={ () => {
                        setQuery(prevState => ({
                            ...prevState,
                            Filters: [
                                {
                                    field: "InformationBySchool.StudentCode",
                                    operator: "==",
                                    value: getValues("input")
                                }
                            ],
                            Page: 1
                        }))
                    }}>Tìm kiếm</Button>
                </Form>
                <Box >
                    <Table<Student>
                        rowKey={(c) => c.id}
                        loading={isPending}
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
        </>
    )
}
export default StudentList