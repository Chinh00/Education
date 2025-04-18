import {useEffect, useMemo, useState} from "react";
import { useGetEducations } from "../hooks/useGetEducations";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from 'material-react-table'
import {IconButton, Tooltip} from "@mui/material";
import { Eye } from "lucide-react";
import {Education} from "@/domain/education.ts";
import {Query} from "@/infrastructure/query.ts";
const EducationList = () => {
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 10,
    })
    const {data, isPending} = useGetEducations(query)






    const columns = useMemo<MRT_ColumnDef<Education>[]>(
        () => [
            {
                accessorKey: 'name', 
                header: 'Tên chương trình đào tạo',
                size: 150,
            },
            {
                accessorKey: 'code', 
                header: 'Mã chương trình',
                size: 150,
            },
            {
                accessorKey: 'trainingTime', 
                header: 'Thời gian đào tạo',
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

export default EducationList;