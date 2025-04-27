import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {setFilters, StudentState} from "@/app/modules/student/stores/student_slice.ts";
import {useEffect, useState} from "react";
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
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";

const EducationSearch = () => {
    const {filters} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")



    const { data, isPending, isSuccess} = useGetEducations({
        Filters: [
            {
                field: "SpecialityCode",
                operator: "In",
                value: filters?.specialityCode ?? "",
            },
            {
                field: "CourseCode",
                operator: filters?.courseCode ? "==" : "!=",
                value: filters?.courseCode ?? "",
            }
        ],
        Page: 1,
        PageSize: 100
    }, filters?.specialityCode !== undefined)



    useEffect(() => {
        if (value !== "") {
            dispatch(setFilters({
                ...filters,
                educationCode: value
            }))
        }
    }, [value]);

    useEffect(() => {
        if (data) {
            dispatch(setFilters({
                ...filters,
                educationCode: data?.data?.data?.items?.map(c => c.code)?.join(",")
            }))
        }
    }, [data]);



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
                            ? data?.data?.data?.items.find((item) => item.code === value)?.name
                            : "Chọn chương trình học"}
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
                                    !!data && data?.data?.data?.items?.map((item) => {
                                        return (
                                            <CommandItem
                                                key={item.code}
                                                value={item.code}
                                                onSelect={(currentValue) => {
                                                    setValue(item.code)

                                                    setOpen(false)
                                                }}
                                            >
                                                {item.name}
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

export default EducationSearch