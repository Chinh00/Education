import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {setStudentListSearch, StudentState} from "@/app/modules/student/stores/student_slice.ts";
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
    const {studentListSelected} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")


    const [query, setQuery] = useState<Query>({

        Page: 1,
        PageSize: 1000
    })

    const { data, isPending, isSuccess} = useGetSpecialityDepartments(query)


    useEffect(() => {
        studentListSelected?.departmentCode && setQuery(prevState => ({...prevState,
            Filters: [
                {
                    field: "DepartmentCode",
                    operator: "==",
                    value: studentListSelected?.departmentCode!,
                },
            ],
        }))
    }, [studentListSelected?.departmentCode]);

    useEffect(() => {
        if (value !== "") {
            dispatch(setStudentListSearch({...studentListSelected, specialityCode: value}))
        }
    }, [value]);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[300px] justify-between"
                    >
                        {value
                            ? data?.data?.data?.items.find((item) => item.specialityCode === value)?.specialityName
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
                                    !!data && data?.data?.data?.items?.filter(c => c.specialityParentCode === null)?.map((item) => {
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