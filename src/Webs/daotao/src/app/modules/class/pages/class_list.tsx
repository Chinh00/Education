import {useEffect, useMemo, useState} from "react";
import { useGetClasses } from "../hooks/useGetClasses";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from "material-react-table";
import {IconButton, Tooltip} from "@mui/material";
import {Eye} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";
import { ClassManager } from "@/domain/class_manager";

const ClassList = () => {
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 10,
    })
    const {data, isPending} = useGetClasses(query)




    const columns = useMemo<MRT_ColumnDef<ClassManager>[]>(
        () => [
            {
                accessorKey: 'classCode',
                header: 'Mã lớp',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'className',
                header: 'Tên lớp',
                size: 150,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'educationCode',
                header: 'Mã chương trình đào tạo',
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

export default ClassList