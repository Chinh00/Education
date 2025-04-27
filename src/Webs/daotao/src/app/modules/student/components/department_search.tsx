import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {StudentState, setQuery, setEducationQuery} from "@/app/modules/student/stores/student_slice.ts";
import {useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {useGetDepartments} from "@/app/modules/common/hook.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/app/components/ui/popover.tsx";
import {Button} from "@/app/components/ui/button.tsx";
import {Check, ChevronsUpDown, Loader} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/app/components/ui/command.tsx";
import {cn} from "@/app/lib/utils.ts";

const DepartmentSearch = () => {
    const {educationQuery} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();

    const [departmentQuery, setDepartmentQuery] = useState<Query>({})
    const [open, setOpen] = useState(false)
    const {data: departments, isPending, isSuccess} = useGetDepartments(departmentQuery, open)
    const [value, setValue] = useState("")


    return (
        < >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[300px] justify-between"
                    >
                        {value
                            ? departments?.data?.data?.items?.find((item) => item.departmentCode === value)?.departmentName
                            : "Chọn khoa"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Chọn khoa" className="h-9" />
                        <CommandList>
                            {isSuccess && <CommandEmpty>Không có dữ liệu</CommandEmpty>}
                            <CommandGroup>
                                {
                                    !!departments && departments?.data?.data?.items?.map((item) => {
                                        return (
                                            <CommandItem
                                                key={item.id}
                                                value={item.departmentCode}
                                                onSelect={(currentValue) => {
                                                    setValue(item.id)
                                                    dispatch(setEducationQuery({
                                                        ...educationQuery,
                                                        Filters: [
                                                            ...educationQuery?.Filters?.filter(c => c.field !== "SpecialityPath") ?? [],
                                                            {
                                                                field: "SpecialityPath",
                                                                value: item.id,
                                                                operator: "Contains"
                                                            }
                                                        ],
                                                    }))
                                                    setOpen(false)
                                                }}
                                            >
                                                {item.departmentName}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === item.departmentCode ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        )
                                    })
                                }
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    {isPending && <Loader size={"30"} className={"mx-auto my-10 animate-spin"} />}
                </PopoverContent>
            </Popover>
        </>
    )
}

export default DepartmentSearch