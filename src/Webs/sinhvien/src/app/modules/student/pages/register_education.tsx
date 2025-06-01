import React, {useEffect, useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import {Checkbox, GetProp, Progress, RadioChangeEvent, TableProps} from 'antd';
import {Table } from 'antd';
import { Box, Typography } from '@mui/material';
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import {useGetEducations, useGetSubjects} from "@/app/modules/common/hook.ts";
import { EducationSubject } from '@/domain/education_subject';
import {useGetRegisterStateCurrent} from "@/app/modules/student/hooks/useGetRegisterStateCurrent.ts";
import dayjs from "dayjs";
import {isNowBetweenServerTime} from "@/infrastructure/datetime_format.ts";
import {Button} from "antd";
import {AlertCircle, BookOpen, Calendar, CheckCircle, Clock, GraduationCap, MapPin, RefreshCcw} from "lucide-react"
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
import {useCreateRegisterWish} from "../hooks/useCreateRegisterWish.ts"
import toast from "react-hot-toast";
import { Subject } from '@/domain/subject.ts';
import {Badge} from "@/app/components/ui/badge.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select.tsx";
import RegistrationTimer from "@/app/modules/student/components/reigstration_timer.tsx";
import {useGetRegisterSubjectCurrent} from "@/app/modules/student/hooks/useGetRegisterSubjectCurrent.ts";









const RegisterEducation= () => {
    const {data, isPending, isSuccess} = useGetStudentInformation()




    const {data: educations, isPending: educationsLoading} = useGetEducations({
        Filters: [
            {
                field: "Code",
                operator: "==",
                value: data?.data?.data?.educationPrograms?.map(c => c.code).join(",")!
            }
        ],
        Includes: ["EducationSubjects"]
    }, isSuccess)
    const [dataAdd, setDataAdd] = useState<Subject[]>([])

    const {data: registerCurrentState, isPending: registerCurrentStateLoading, isSuccess: registerCurrentStateSuccess, refetch} = useGetRegisterStateCurrent()
    const { mutate, isPending: mutateLoading} = useCreateRegisterWish()

    const {data: subjects, isLoading: subjectsLoading, isSuccess: subjectsSuccess} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: educations?.data?.data?.items?.[0]?.educationSubjects?.join(",")!
            }
        ],
        Includes: ["IsCalculateMark"],
        Page: 1,
        PageSize: 1000
    }, educations?.data?.data?.items?.[0] !== undefined)



    const [selectedEducation, setSelectedEducation] = useState<string>()

    useEffect(() => {
        if (data) {
            setSelectedEducation(data?.data?.data?.educationPrograms[0]?.code)
        }
    }, [data]);


    const columns: ColumnsType<Subject> = [
        {
            title: 'Nguyện vọng',
            key: 'action',
            render: (_, record) => (
                <Checkbox disabled={!isNowBetweenServerTime(registerCurrentState?.data?.data?.staDate, registerCurrentState?.data?.data?.endDate)} checked={dataAdd?.filter(c => c.subjectCode === record?.subjectCode)?.length > 0} onChange={(e) => {

                    if (dataAdd?.filter(c => c.subjectCode === record?.subjectCode)?.length > 0) {
                        setDataAdd(prevState => [
                            ...prevState?.filter(c => c.subjectCode !== record?.subjectCode) ?? [],
                        ])
                    } else {
                        setDataAdd(prevState => [
                            ...prevState,
                            record
                        ])
                    }

                }}  />
            ),

        },
        {
            title: 'Mã môn học',
            dataIndex: "subjectCode",
            key: 'subjectCode',

        },
        {
            title: 'Tên môn học',
            dataIndex: "subjectName",
            key: 'subjectName',

        },
        {
            title: 'Là môn tính điểm',
            dataIndex: 'isCalculateMark',
            key: 'isCalculateMark',
            render: (value, record) => {
                return <Checkbox  defaultChecked={record?.isCalculateMark} disabled={true} />
            },
        },


        {
            title: 'Số tín chỉ',
            dataIndex: "numberOfCredits",
            key: 'numberOfCredits',

        },
    ];

    const {data: registerSubject} = useGetRegisterSubjectCurrent(educations?.data?.data?.items[0]?.code ?? "", educations?.data?.data?.items[0]?.code !== undefined)

    useEffect(() => {
        if (registerSubject && registerSubject?.data?.data !== undefined && subjects?.data?.data?.items !== undefined) {
            setDataAdd(prevState => [
                ...prevState,
                ...subjects?.data?.data?.items?.filter(c => registerSubject?.data?.data?.subjectCodes?.includes(c?.subjectCode)) ?? []
            ])
        }
    }, [registerSubject, subjects?.data?.data?.items]);


    return (
        <PredataScreen isLoading={isPending } isSuccess={isSuccess }>
            <div className={"flex flex-col gap-5 w-full"}>
                <Select value={selectedEducation} onValueChange={(value) => {
                    const edu = data?.data?.data?.educationPrograms?.find(e => e.code === value);
                    if (edu) setSelectedEducation(edu?.code);
                }}>
                    <SelectTrigger className={"w-full"} >
                        <SelectValue placeholder="Chương trình đào tạo" />
                    </SelectTrigger>
                    <SelectContent>
                        {!!data && data?.data?.data?.educationPrograms?.map((item, index) => (
                            <SelectItem value={item?.code} key={item?.code}>{item?.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>



                <Box className={"flex flex-row justify-between w-full"}>
                    <RegistrationTimer startTime={''} endTime={''} timeSlot={`${registerCurrentState?.data?.data?.minCredit} - ${registerCurrentState?.data?.data?.maxCredit}`} />
                </Box>
                <div className={"relative w-full inset-0 min-h-[450px]"}>
                    {!isNowBetweenServerTime(registerCurrentState?.data?.data?.staDate, registerCurrentState?.data?.data?.endDate) &&
                        <div className={"absolute left-1/2 top-1/2 z-50 -translate-y-1/2 -translate-x-1/2"}>
                            <Badge
                                variant="outline"
                                className={`
                              cursor-pointer transition-all duration-300 transform hover:scale-105
                              px-3 py-1 text-sm font-medium
                              bg-red-100 text-[#FFEB3B] border-red-300 hover:bg-red-200
                            `}
                                onClick={() => {}}
                            >
                                <div className="flex items-center space-x-2 text-black">
                                    <AlertCircle />
                                    <span>Chưa đến thời gian đăng ký</span>
                                </div>
                            </Badge>
                        </div>
                    }

                    <Table<Subject>
                        className={"absolute top-0"}
                        rowKey={(c) => c.id}
                        loading={subjectsLoading }
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white bg-gradient-to-r from-green-600 to-teal-600"}>
                            <Typography variant="h6" gutterBottom>Danh sách môn được chọn</Typography>
                        </Box>}
                        showHeader={true}
                        size={"small"}
                        bordered={true}

                        columns={columns}
                        pagination={false}
                        dataSource={subjects?.data?.data?.items ?? []}
                        virtual
                        scroll={{ y: 300 }}
                    />
                </div>


                <div className={"w-full relative min-h-[250px]"}>
                    <Table<Subject>
                        rowKey={(c) => c.id}
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-start items-center p-[16px] text-white bg-blue-400"}>
                            <CheckCircle className="h-5 w-5 mr-2"  />
                            <Typography variant="h6" gutterBottom> Môn học đã chọn ( Đã chọn {dataAdd?.length} môn)</Typography>
                        </Box>}
                        size={"small"}
                        bordered={true}
                        columns={columns}
                        pagination={false}
                        dataSource={dataAdd}
                    />
                </div>
                <Box className={" mt-[20px] w-full flex justify-end gap-5"}>
                    <Button type={"default"} onClick={() => setDataAdd([])}>Huỷ thay đổi</Button>
                    <Button loading={mutateLoading} type={"primary"} onClick={() => [
                        mutate({
                            educationCode: data?.data?.data?.educationPrograms[0]?.code!,
                            subjectCodes: dataAdd.map(c => c.subjectCode)
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