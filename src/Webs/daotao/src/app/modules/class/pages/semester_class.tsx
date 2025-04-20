import { useParams } from "react-router";
import {useGetClasses} from "@/app/modules/class/hooks/useGetClasses.ts";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from "material-react-table";
import {ClassManager} from "@/domain/class_manager.ts";
import {Semesterclass} from "@/domain/semester_class.ts";
import {Eye} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";
import {useForm} from "react-hook-form";
import AddSemester from "@/app/modules/class/components/add_semester.tsx";

export type SemesterClassProps = {

}

const SemesterClass = () => {
    const { id } = useParams();
    const {data, isPending} = useGetClasses({
        Filters: [
            {
                field: "ClassCode",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["SemesterClasses"]
    })
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 10,
    })
    const columns = useMemo<MRT_ColumnDef<Semesterclass>[]>(() => [
        {
            accessorKey: 'semesterCode',
            header: 'Mã học kì',
            size: 150,
            muiTableHeadCellProps: {
                align: 'center',
            },
            muiTableBodyCellProps: {
                align: 'center',
            },
        },
    ], []);
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
        data: data?.data?.data?.items[0]?.semesterClasses ?? [],
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
                <AddSemester />
            </Box>
        ),
    });

    const {control} = useForm<ClassManager>({

    })
    return (
        <>
            <Box className={""}>
                <Typography variant="body2" fontSize={20} color="textSecondary" gutterBottom component="div" className={"flex justify-center gap-2"}>Thông tin lớp học <div className={"text-red-500 font-bold"}>{id}</div></Typography>
                <Box className={"flex flex-col gap-5 py-5"}>

                </Box>
                <MaterialReactTable table={table} />
            </Box>
        </>
    )
}

export default SemesterClass