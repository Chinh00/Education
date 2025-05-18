import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box, IconButton} from "@mui/material";
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {Table, Tooltip} from "antd";
import {Eye} from "lucide-react";
import {CourseClass} from "@/domain/course_class.ts";
import CourseClassType from "@/app/modules/education/components/courseClassType.tsx";
import {Query} from "@/infrastructure/query.ts";
import {useNavigate} from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";

const CourseClassReport = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Báo cáo lớp đăng ký"}));
    }, []);
    const [query, setQuery] = useState<Query>({})
    const {data, isLoading, isSuccess} = useGetCourseClasses(query)
    const nav = useNavigate()
    const columns: ColumnsType<CourseClass> = [
        {
            title: 'Tên lớp học',
            dataIndex: "courseClassCode",
        },
        {
            title: 'Loại lớp',
            render: (text, record) => (
                <CourseClassType courseClassType={record?.courseClassType} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Tooltip title="Chi tiết">
                    <IconButton onClick={() => nav(RoutePaths.EDUCATION_REGISTER_COURSE + `/${record?.id}`)}><Eye /></IconButton>
                </Tooltip>
            ),
        },

    ];
    const tableColumns = columns.map((item) => ({ ...item }));


    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <Box>
                <Table<CourseClass>
                    rowKey={(c) => c.id}
                    loading={isLoading}
                    style={{
                        height: "500px",
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                        {/*<Button onClick={() => {nav(RoutePaths.EDUCATION_REGISTER_CONFIG)}} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>*/}
                    </Box>}
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
    )
}
export default  CourseClassReport ;