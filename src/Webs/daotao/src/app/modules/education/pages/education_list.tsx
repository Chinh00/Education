import {useEffect, useMemo, useState} from "react";
import { useGetEducations } from "../hooks/useGetEducations";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from 'material-react-table'
import {Box, IconButton, Tooltip} from "@mui/material";
import { Eye, Settings } from "lucide-react";
import {Education} from "@/domain/education.ts";
import {Query} from "@/infrastructure/query.ts";
import SearchOptions from "@/app/modules/education/components/search_options.tsx";
import CourseSearch from "@/app/modules/education/components/course_search.tsx";
import SpecialitySearch from "@/app/modules/education/components/speciality_search.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {EducationState, setQuery} from "@/app/modules/education/stores/education_slice.ts";
import {useNavigate} from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";


const EducationList = () => {
    const state = useAppSelector<EducationState>(c => c.education)
    const dispatch = useAppDispatch()
    const {data, isPending} = useGetEducations(state.query)

    const columns = useMemo<MRT_ColumnDef<Education>[]>(
        () => [
            {
                accessorKey: 'name', 
                header: 'Tên chương trình đào tạo',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'code', 
                header: 'Mã chương trình',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'trainingTime', 
                header: 'Thời gian đào tạo',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
        ],
        [],
    );
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const nav = useNavigate()
    useEffect(() => {
        // setQuery(prevState => ({
        //     ...prevState,
        //     Page: pagination.pageIndex + 1,
        //     PageSize: pagination.pageSize,
        // }))
        dispatch(setQuery({
            ...state.query,
            Page: pagination.pageIndex + 1,
            PageSize: pagination.pageSize,
        }))
    }, [pagination]);
    
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
        renderRowActions: ({row, table}) => {
            return <>
                <Tooltip title={"Xem chi tiết"} >
                    <IconButton
                        color="primary"
                        onClick={() => {

                        }}
                    >
                        <Eye />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Cấu hình đăng ký học"} >
                    <IconButton
                        color="primary"
                        onClick={() => {
                            nav(`/register-config/${row.original.code}`)
                        }}
                    >
                        <Settings />
                    </IconButton>
                </Tooltip>

            </>
        }
    });





    return (
        <>
            <Box className={"p-5 flex gap-5"}>
                <CourseSearch  />
                <SearchOptions />
                <SpecialitySearch />
            </Box>
            <MaterialReactTable table={table}  />
        </>
    )

}

export default EducationList;