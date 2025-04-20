import { useParams } from "react-router";
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";
import {useEffect, useMemo, useState} from "react";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from "material-react-table";
import {Semester} from "@/domain/semester.ts";
import {EducationSubject} from "@/domain/education_subject.ts";
import {Box, IconButton, Tooltip} from "@mui/material";
import SemesterModal from "@/app/modules/semester/components/semester_modal.tsx";
import {Eye} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";

const RegisterConfig = () => {
    const {id} = useParams();
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 10,
    })
    const {data, isPending} = useGetEducations({
        Filters: [
            {
                field: "Code",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["EducationSubjects"]
    })
    const columns = useMemo<MRT_ColumnDef<EducationSubject>[]>(() => [
        {
            accessorKey: 'subject.subjectName',
            header: 'Tên môn học',
            size: 100,
            muiTableHeadCellProps: {
                align: 'center',
            },
            muiTableBodyCellProps: {
                align: 'center',
            },
        },
        {
            accessorKey: 'subject.subjectCode',
            header: 'Mã môn học',
            size: 100,
            muiTableHeadCellProps: {
                align: 'center',
            },
            muiTableBodyCellProps: {
                align: 'center',
            },
        },
        // {
        //     accessorKey: 'subject.subjectNameEng',
        //     header: 'Mã môn học',
        //     size: 100,
        //     muiTableHeadCellProps: {
        //         align: 'center',
        //     },
        //     muiTableBodyCellProps: {
        //         align: 'center',
        //     },
        // },

    ], [])

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
        data: data?.data?.data?.items[0]?.educationSubjects ?? [],
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
  return (
      <>
          <Box>

          </Box>
        <MaterialReactTable table={table}  />
      </>
  )
}

export default RegisterConfig