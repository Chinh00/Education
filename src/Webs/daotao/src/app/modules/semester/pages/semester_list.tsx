import { useGetSemesters } from "../hooks/useGetSemesters";
import {useEffect, useMemo, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from "material-react-table";
import {Box, Button, IconButton, Tooltip} from "@mui/material";
import {Download, Eye, Plus} from "lucide-react";
import {Semester} from "@/domain/semester.ts";
import SemesterModal from "@/app/modules/semester/components/semester_modal.tsx";

const SemesterList = () => {
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 10,
    })
    const {data, isPending} = useGetSemesters(query);

    const columns = useMemo<MRT_ColumnDef<Semester>[]>(
        () => [
            {
                accessorKey: 'semesterCode',
                header: 'Mã kì học',
                size: 150,
            },
            {
                accessorKey: 'semesterName',
                header: 'Tên kì học',
                size: 150,
            },
            {
                accessorKey: 'startDate',
                header: 'Thời gian bắt đầu',
                size: 150,
            },
            {
                accessorKey: 'endDate',
                header: 'Thời gian kết thúc',
                size: 150,
            },

        ],
        [],
    );
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    useEffect(() => {
        setQuery(prevState => ({
            ...prevState,
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
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}

            >
                <SemesterModal />

            </Box>
        ),
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
            </>
        }
    });

    return <MaterialReactTable table={table}  />;

}

export default SemesterList