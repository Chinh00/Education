import {Button, Card, Form, Input, Modal, Table, Tooltip, Typography} from "antd";
import {CourseClass} from "@/domain/course_class.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {Box, Divider} from "@mui/material";
import {debounce} from "lodash";
import {Query} from "@/infrastructure/query.ts";
import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import {ColumnsType, useGetStaffs} from "@/app/modules/common/hook.ts";
import {Staff} from "@/domain/staff.ts";
import {PlusCircle} from "lucide-react";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import toast from "react-hot-toast";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import _ from "lodash";
export type AssignmentTeacherProps = {
    courseClass?: CourseClass
    refetch?: any,
    onClick: (selectedTeacher: string, teacherName: string, list: string[]) => void,
    departmentCode?: string,
    courseClassStage?: number
}

const AssignmentTeacher = (props: AssignmentTeacherProps) => {
    const [selectedStaff, setSelectedStaff] = useState<string>()
    const columns: ColumnsType<Staff> = [
        {
            title: 'Chọn',
            key: "action",
            render: (value, record) => (
                <Tooltip title={"Chọn giáo viên này"} >
                    <Button
                        size="small" className={"border-none"}
                        disabled={selectedStaff === record?.code}
                        onClick={() => {
                            setSelectedStaff(record?.code!)
                        }}
                    ><PlusCircle size={15} /></Button>
                </Tooltip>
            ),
            width: 80
        },
        {
            title: 'Họ và tên',
            dataIndex: "fullName",
        },
        {
            title: 'Mã nhân viên',
            dataIndex: "code",
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));
    
    
    
    
    const [searchKeyword, setSearchKeyword] = useState("");

    

    const [query, setQuery] = useState({
        Filters: [
            {
                field: "DepartmentCode",
                operator: "Contains",
                value: props?.departmentCode!
            },
        ],
        Includes: ["Code"],
        Page: 1,
        PageSize: 100
    })
    const {data: staffs, isLoading} = useGetStaffs(query, props?.departmentCode !== undefined )
 

    const {data: courseClasses} = useGetCourseClasses({
        Filters: [
            {
                field: "TeacherCode",
                operator: '==',
                value: selectedStaff!,
            },
            {
                field: "Stage",
                operator: 'In',
                value: props?.courseClassStage !== 2 ? [props?.courseClassStage, 2].join(",") : "0,1,2"
            },
            
        ],
        Page: 1,
        PageSize: 100
    }, selectedStaff !== undefined && selectedStaff !== "" && props?.courseClassStage !== undefined && props?.courseClassStage !== null);


    useEffect(() => {
        
        const courseClassCodes = courseClasses?.data.data.items.map(c => c.courseClassCode);
        
        props.onClick(selectedStaff!, staffs?.data?.data?.items?.filter(e => e.code === selectedStaff)[0]?.fullName ?? "", courseClassCodes ?? []);
        
    }, [selectedStaff, courseClasses]);




    const debouncedSearch = useRef(
        debounce((keyword: string) => {
            setQuery(prev => ({
                ...prev,
                Filters: [
                    {
                        field: "FullName",
                        operator: keyword !== "" ? "Contains" : "!=",
                        value: keyword !== "" ? keyword : "-1"
                    },
                ]
            }));
        }, 500)
    ).current;

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);
    
    
    return (
        <>
            <Card className={"w-full p-5 space-y-5"}>
                <Input.Search value={searchKeyword} size={"large"} placeholder={"Tìm theo tên giảng viên"}
                              onChange={e => {
                                  setSearchKeyword(e.target.value);
                                  debouncedSearch(e.target.value);
                              }}
                />
                <Divider className={"py-3"} />
                <Box className={"w-full"}>
                    <div className={"relative w-full min-h-[500px]"}>
                        <Table<Staff>
                            rowKey={(c) => c.id}
                            loading={isLoading}
                            className={"absolute top-0 left-0 w-full"}

                            showHeader={true}
                            title={() => <Box className={"flex flex-row justify-end items-center p-[16px] text-white "}>
                                <Typography.Title level={4} className={"text-center w-full"} >Các giáo viên phù hợp</Typography.Title>
                            </Box>}
                            size={"small"}

                            pagination={false}
                            virtual
                            scroll={{ x: 300, y: 300 }}
                            bordered={true}
                            columns={tableColumns}
                            dataSource={staffs?.data?.data?.items ?? []}
                        />
                    </div>
                </Box>

            </Card>
        </>
    )
}
export default AssignmentTeacher;