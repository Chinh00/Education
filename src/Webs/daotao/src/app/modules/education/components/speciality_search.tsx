import {useGetCourses, useGetDepartments, useGetSpecialityDepartments} from "@/app/modules/common/hook.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
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
import {getDepartments} from "@/app/modules/common/service.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {EducationState, setQuery} from "@/app/modules/education/stores/education_slice.ts";

export type SpecialitySearchProps = {
}

const SpecialitySearch = (props: SpecialitySearchProps) => {
    const state = useAppSelector<EducationState>(c => c.education)
    const dispatch = useAppDispatch();

    const [departmentQuery, setDepartmentQuery] = useState<Query>({

    })
    useEffect(() => {
        if (state?.query?.Filters?.filter(c => c.field === "SpecialityPath")[0]?.value)
        setDepartmentQuery(prevState => ({
            ...prevState,
            Filters: [
                ...prevState?.Filters?.filter(c => c.field !== "Id") ?? [],
                {
                    field: "Id",
                    operator: "Contains",
                    value: state?.query?.Filters?.filter(c => c.field === "SpecialityPath")[0]?.value ?? "",
                }
            ],
            Includes: ["Specialities"]
        }))
    }, [state.query]);

    const [open, setOpen] = useState(false)
    const {data: departments, isPending, isSuccess} = useGetSpecialityDepartments(departmentQuery, open)

    const [value, setValue] = useState("")
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
                            ? departments?.data?.data?.items?.find((item) => item.departmentCode === value)?.departmentCode
                            : "Chọn ngành học"}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Chọn ngành học" className="h-9" />
                        <CommandList>
                            {isSuccess && <CommandEmpty>Không có dữ liệu</CommandEmpty>}
                            <CommandGroup>
                                {
                                    !!departments && departments?.data?.data?.items[0]?.specialities?.map((item, index) => {
                                        return (
                                            <CommandItem
                                                key={`${item.specialityCode}-${index}`}
                                                value={item.specialityCode}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    dispatch(setQuery({
                                                        ...state.query,
                                                        Filters: [
                                                            ...state.query?.Filters?.filter(c => c.field !== "SpecialityPath") ?? [],
                                                            {
                                                                field: "SpecialityPath",
                                                                value: `${state?.query?.Filters?.filter(c => c.field === "SpecialityPath")[0]?.value}.${index}`,
                                                                operator: "Contains"
                                                            }
                                                        ]
                                                    }))
                                                    setOpen(false)
                                                }}
                                            >
                                                {item.specialityName }
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

export default SpecialitySearch