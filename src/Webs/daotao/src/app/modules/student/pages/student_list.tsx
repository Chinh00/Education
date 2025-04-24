import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useMemo, useState} from "react";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Student} from "@/domain/student.ts";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router";
import loadable from "@loadable/component";
import {StudentState} from "@/app/modules/student/stores/student_slice.ts";
const CourseSearch = loadable(() => import('../components/course_search.tsx'), {
    fallback: <div>Loading...</div>,
})



const StudentList = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách sinh viên"}));
    }, []);

    const {query} = useAppSelector<StudentState>(c => c.student)

    const {data, isSuccess, isPending} = useGetStudents(query)

    const columns = useMemo<MRT_ColumnDef<Student>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Mã',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            }
        ],
        [],
    );
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const nav = useNavigate()
    const table = useMaterialReactTable({
        columns,
        data: data?.data?.data?.items ?? [],
        state: {
            isLoading: isPending,
            pagination: pagination,
        },
        initialState: {
            density: 'compact',
            showGlobalFilter: true
        },
        muiTableProps: {
            padding: "normal"
        },
        enablePagination: true,
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: data?.data?.data?.totalItems ?? 0,
        enableDensityToggle: false,
        enableGlobalFilter: true,
        enableRowActions: true,
        positionActionsColumn: "last",
        // renderRowActions: ({row, table}) => {
        //     return <>
        //         <Tooltip title={"Xem chi tiết"} >
        //             <IconButton
        //                 color="primary"
        //                 onClick={() => {
        //
        //                 }}
        //             >
        //                 <Eye />
        //             </IconButton>
        //         </Tooltip>
        //         <Tooltip title={"Cấu hình đăng ký học"} >
        //             <IconButton
        //                 color="primary"
        //                 onClick={() => {
        //                     nav(`/register-config/${row.original.code}`)
        //                 }}
        //             >
        //                 <Settings />
        //             </IconButton>
        //         </Tooltip>
        //
        //     </>
        // }
    });

    return (
        <>
            <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
                <Box >
                    <CourseSearch />
                    <MaterialReactTable table={table}  />
                </Box>
            </PredataScreen>
        </>
    )
}
export default StudentList