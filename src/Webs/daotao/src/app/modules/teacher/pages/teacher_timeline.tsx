import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Button as ButtonAntd, Input, Table, Typography} from "antd"
import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {GripVertical, Plus} from "lucide-react";
import {CourseClassModel, SlotTimelineModel} from "@/app/modules/education/services/courseClass.service.ts";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {useForm} from "react-hook-form";
import {useCreateCourseClass} from "@/app/modules/education/hooks/useCreateCourseClass.ts";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
import {Query} from "@/infrastructure/query.ts";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {ColumnsType, useGetStaffs} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {Staff} from "@/domain/staff.ts";
import TeacherTimelineModal from "@/app/modules/teacher/components/teacher_timeline_modal.tsx";
import {Badge} from "@/app/components/ui/badge.tsx";
import {debounce} from "lodash";




const TeacherTimeline = () => {const dispatch = useAppDispatch();
    const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Thời khóa biểu giáo viên" }));
    }, []);

    const { userInfo } = useAppSelector<CommonState>(e => e.common);
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "DepartmentCode",
                operator: userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! !== "admin" ? "Contains" : "!=",
                value: userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! !== "admin" ? userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! : ""
            }
        ],
    })

    const columns: ColumnsType<Staff> = [

        {
            title: 'Mã môn học',
            dataIndex: "fullName",
        },
        {
            title: 'Mã phòng ban',
            dataIndex: "departmentCode",
        },
        {
            title: 'Mã giáo viên',
            dataIndex: "code",
        },
        
        {
            title: 'Hành động',
            render: (text, record) => (
                <>
                    <TeacherTimelineModal staffCode={record?.code} />
                </>
            )
        },
    ];

    const tableColumns = columns.map((item) => ({ ...item }));

    const {data: staff, isLoading} = useGetStaffs(query)
    const [searchKeyword, setSearchKeyword] = useState("")
    

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
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"space-y-5"}>
                <Table<Staff>
                    rowKey={(c) => c.id}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-col justify-between items-center p-[16px] text-white "}>
                        <Input.Search value={searchKeyword} size={"large"} placeholder={"Tìm theo giáo viên"}
                                      onChange={e => {
                                          setSearchKeyword(e.target.value);
                                          debouncedSearch(e.target.value);
                                      }}

                        />
                        

                    </Box>}
                    size={"small"}
                    bordered={true}
                    pagination={{
                        current: query?.Page ?? 1,
                        pageSize: query?.PageSize ?? 10,
                        total: staff?.data?.data?.totalItems ?? 0
                    }}
                    onChange={(e) => {
                        setQuery(prevState => ({
                            ...prevState,
                            Page: e?.current ?? 1 - 1,
                            PageSize: e?.pageSize
                        }))
                    }}
                    columns={tableColumns}
                    dataSource={staff?.data?.data?.items ?? []}

                />
                
            </Box>
        </PredataScreen>
    )
}
export default TeacherTimeline;