import React, {useEffect, useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { GetProp, RadioChangeEvent, TableProps } from 'antd';
import { Form, Radio, Select, Space, Switch, Table } from 'antd';
import { Box, Typography } from '@mui/material';
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import {useGetEducations} from "@/app/modules/common/hook.ts";
import { EducationSubject } from '@/domain/education_subject';
import {useGetRegisterStateCurrent} from "@/app/modules/student/hooks/useGetRegisterStateCurrent.ts";
import dayjs from "dayjs";
import {isNowBetweenServerTime} from "@/infrastructure/datetime_format.ts";
import {Button} from "antd";
import {RefreshCcw} from "lucide-react"
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
import {useCreateRegisterWish} from "../hooks/useCreateRegisterWish.ts"
import toast from "react-hot-toast";

const columns: ColumnsType<EducationSubject> = [
    {
        title: 'Tên môn học',
        dataIndex: ['subject', "subjectName"],
    },
    {
        title: 'Mã môn học',
        dataIndex: ["subject", "subjectCode"],
    },

    {
        title: 'Action',
        key: 'action',
        sorter: true,
        render: () => (
            <Space size="middle">
                <a>Delete</a>
                <a>
                    <Space>
                        More actions
                        <DownOutlined />
                    </Space>
                </a>
            </Space>
        ),
    },
];






const RegisterEducation: React.FC = () => {

    const {data: studentInformation, isPending, isSuccess} = useGetStudentInformation()
    const {data: educations, isPending: isLoading} = useGetEducations({
        Filters: [
            {
                field: "Code",
                operator: "==",
                value: studentInformation?.data?.data?.informationBySchool?.educationCodes[0]!
            }
        ],
        Includes: ["EducationSubjects"]
    }, isSuccess)
    const [dataAdd, setDataAdd] = useState<EducationSubject[]>([])

    const tableColumns = columns.map((item) => ({ ...item }));
    const {data: registerCurrentState, isPending: registerCurrentStateLoading, isSuccess: registerCurrentStateSuccess, refetch} = useGetRegisterStateCurrent()
    const { mutate, isPending: mutateLoading} = useCreateRegisterWish()



    return (
        <PredataScreen isLoading={isPending || registerCurrentStateLoading} isSuccess={isSuccess && registerCurrentStateSuccess}>

            <div className={"flex flex-col gap-10"}>
                <Select
                    defaultValue={studentInformation?.data?.data?.informationBySchool?.educationCodes[0]}
                    className={"w-full"}
                    onChange={() => {

                    }}
                    loading={isLoading}
                    options={educations?.data?.data?.items.map((e) => ({ label: e?.name, value: e?.code }))}
                />
                <Box>
                    <div>
                        <Typography>Thời gian bắt đầu đăng ký: {dayjs(registerCurrentState?.data?.data?.staDate).format("HH:mm:ss DD-MM-YYYY")}</Typography>
                        <Typography>Thời gian kết thúc đăng ký: {dayjs(registerCurrentState?.data?.data?.endDate).format("HH:mm:ss DD-MM-YYYY")}</Typography>
                    </div>
                    <div>
                        <Button className={"px-10"} onClick={() => refetch()}><RefreshCcw /></Button>
                    </div>
                </Box>
                <div>
                    <Table<EducationSubject>
                        rowKey={(c) => c.subject.subjectCode}
                        loading={isLoading}
                        style={{
                            height: "200px",
                            position: "relative"
                        }}
                        virtual
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white bg-green-600"}>
                            <Typography variant="h6" gutterBottom>Đăng ký học: {registerCurrentState?.data?.data?.semesterCode}</Typography>
                            <Typography className={"font-bold text-red-800"}>Bạn được đăng ký tín chỉ trong khoảng [{registerCurrentState?.data?.data?.minCredit}:{registerCurrentState?.data?.data?.maxCredit}]</Typography>
                        </Box>}
                        size={"small"}
                        rowSelection={{
                            onChange: (selectedRowKeys, selectedRows) => {
                                setDataAdd(prevState => [...selectedRows])
                            },
                            getCheckboxProps: (record) => ({
                                disabled: !isNowBetweenServerTime(registerCurrentState?.data?.data?.staDate, registerCurrentState?.data?.data?.endDate)
                            }),
                        }}
                        bordered={true}
                        pagination={false}
                        columns={tableColumns}
                        dataSource={educations?.data?.data?.items[0]?.educationSubjects ?? []}
                        scroll={{
                            y: 300,
                        }}
                    />
                </div>
                <div className={"mt-[150px]"}>
                    <Table<EducationSubject>
                        rowKey={(c) => c.subject.subjectCode}
                        style={{
                            height: "200px",
                            marginTop: "50px",
                            position: "relative"

                        }}
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white bg-blue-400"}>
                            <Typography variant="h6" gutterBottom>Môn học đã chọn ( Đã chọn {dataAdd?.length} môn)</Typography>
                        </Box>}
                        virtual
                        size={"small"}
                        bordered={true}
                        columns={tableColumns}
                        dataSource={dataAdd}
                        scroll={{
                            y: 300,
                        }}
                    />
                </div>
                <Box className={" mt-[100px] w-full flex justify-end gap-5"}>
                    <Button type={"default"}>Huỷ thay đổi</Button>
                    <Button loading={mutateLoading} type={"primary"} onClick={() => [
                        mutate({
                            educationCode: studentInformation?.data?.data?.informationBySchool?.educationCodes[0]!,
                            subjectCodes: dataAdd.map(c => c.subject.subjectCode)
                        }, {
                            onSuccess: res => {
                                toast.success("Lưu thành công")
                            }
                        })
                    ]}>Lưu thay đổi</Button>
                </Box>
            </div>
        </PredataScreen>
    );
};

export default RegisterEducation;