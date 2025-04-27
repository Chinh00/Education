import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {setEducationQuery, StudentState} from "@/app/modules/student/stores/student_slice.ts";
import {useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {useGetSpecialityDepartments} from "@/app/modules/common/hook.ts";
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

const BranchSearch = () => {
    const {educationQuery} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [specialQuery, setSpecialQuery] = useState<Query>({
        Includes: ["Specialities"]
    })
    const { data: departmentBranch, isPending, isSuccess } = useGetSpecialityDepartments(specialQuery, educationQuery?.Filters?.filter(c => c.field === "SpecialityPath") !== undefined)

    useEffect(() => {
        if (!departmentBranch?.data?.data?.items) {
            setSpecialQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(c => c.field !== "DepartmentCode") ?? [],
                    {
                        field: "DepartmentCode",
                        operator: "==",
                        value: educationQuery?.Filters?.
                    }
                ]
            }))
        }
    }, [departmentBranch]);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[300px] justify-between"
                    >
                        {value
                            ? departmentBranch?.data?.data?.items[0]?.specialities.find((item) => item.specialityCode === value)?.specialityName
                            : "Chọn nghành học"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Chọn khoá học" className="h-9" />
                        <CommandList>
                            {isSuccess && <CommandEmpty>Không có dữ liệu</CommandEmpty>}
                            <CommandGroup>
                                {
                                    !!departmentBranch?.data?.data?.items[0]?.specialities && departmentBranch?.data?.data?.items[0]?.specialities?.map((item) => {
                                        return (
                                            <CommandItem
                                                key={item.specialityCode}
                                                value={item.specialityCode}
                                                onSelect={(currentValue) => {
                                                    setValue(item.specialityCode)

                                                    setOpen(false)
                                                }}
                                            >
                                                {item.specialityName}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === item.specialityCode ? "opacity-100" : "opacity-0"
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

export default BranchSearch;