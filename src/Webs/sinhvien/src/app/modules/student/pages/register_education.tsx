import React, {useEffect, useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { GetProp, RadioChangeEvent, TableProps } from 'antd';
import { Form, Radio, Select, Space, Switch, Table } from 'antd';
import { Box, Typography } from '@mui/material';
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import {useGetEducations} from "@/app/modules/common/hook.ts";
import { EducationSubject } from '@/domain/education_subject';

type SizeType = TableProps['size'];
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];
type ExpandableConfig<T extends object> = TableProps<T>['expandable'];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];


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

    const [rowSelection, setRowSelection] = useState<TableRowSelection<EducationSubject> | undefined>({});
    const [hasData, setHasData] = useState(true);
    const [top, setTop] = useState<TablePaginationPosition>('none');
    const [bottom, setBottom] = useState<TablePaginationPosition>('bottomRight');

    const [dataAdd, setDataAdd] = useState<EducationSubject[]>([])

    const tableColumns = columns.map((item) => ({ ...item }));
    useEffect(() => {
        console.log(rowSelection)
    }, [rowSelection]);
    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess}>

            <div className={"flex flex-col gap-10"}>
                <Select
                    defaultValue={studentInformation?.data?.data?.informationBySchool?.educationCodes[0]}
                    className={"w-full"}
                    onChange={() => {

                    }}
                    loading={isLoading}
                    options={educations?.data?.data?.items.map((e) => ({ label: e?.name, value: e?.code }))}
                />
                <button onClick={() => {
                    console.log(rowSelection)
                }}>asdas</button>
                <div>
                    <Table<EducationSubject>
                        rowKey={(c) => c.subject.subjectCode}
                        loading={isLoading}
                        style={{
                            height: "200px",
                        }}
                        virtual
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white bg-green-600"}>
                            <Typography variant="h6" gutterBottom>Đăng ký học </Typography>
                            <Typography className={"font-bold text-red-800"}>Bạn được đăng ký tín chỉ trong khoảng [10:30]</Typography>
                        </Box>}
                        size={"small"}
                        rowSelection={{
                            onChange: (selectedRowKeys, selectedRows) => {
                                setDataAdd(prevState => [...selectedRows])
                            },
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
                            marginTop: "100px"
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
            </div>
        </PredataScreen>
    );
};

export default RegisterEducation;