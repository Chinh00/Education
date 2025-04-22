import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState} from "@tanstack/react-table";
import {EducationSubject} from "@/domain/education_subject.ts";
import {useGetEducations} from "@/app/modules/common/hook.ts";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import { Checkbox } from "@/app/components/ui/checkbox";
import {useState} from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react";
import {DropdownMenu,
    DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import Lottie from "lottie-react";
import IconLoading from "@/assets/icons/Animation - 1745297696467.json"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select.tsx";


export const columns: ColumnDef<EducationSubject>[] = [
    {
        accessorKey: "subject.subjectCode",
        header: "Mã môn học",

    },
    {
        accessorKey: "subject.subjectName",
        header: "Tên môn học",

    },
    {
        accessorKey: "subject.numberOfCredits",
        header: "Số tín chỉ",

    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const cell = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(cell.subject.subjectCode)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

const StudentEducation = () => {
    const {data: studentInformation, isPending, isSuccess} = useGetStudentInformation()
    const {data: educations, isPending: isLoading} = useGetEducations({
        Filters: [
            {
                field: "Code",
                operator: "==",
                value: studentInformation?.data?.data?.informationBySchool?.educationCodes[0]!
            }
        ],
        Includes: ["EducationSubjects"]
    }, isSuccess)

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: educations?.data?.data?.items[0]?.educationSubjects ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Select>
                        <SelectTrigger className={"w-full mb-5"} defaultValue={"educationSelected"}>
                            <SelectValue placeholder="Chương trình đào tạo" />
                        </SelectTrigger>
                        <SelectContent>
                            {!!educations && educations?.data?.data?.items?.map((item, index) => (
                                <SelectItem value={item.code} key={item.code}>{item?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table className={""}>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className={"border-[1px]"}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isSuccess && table.getRowModel().rows?.length > 0 && (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={"border-[1px]"}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) }
                            {!isSuccess && <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>}


                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>
                                    {isLoading && <div className={"w-full flex justify-center"}><Lottie animationData={IconLoading} loop={true} className={"w-[200px]"}  /></div>}
                                </TableCell>
                            </TableRow>
                        </TableFooter>

                    </Table>
                </div>
            </div>

        </PredataScreen>
    )
}

export default StudentEducation