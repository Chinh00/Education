import {useGetCourses, useGetDepartments} from "@/app/modules/common/hook.ts";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import {Check, ChevronsUpDown, Loader} from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command";
import {cn} from "@/app/lib/utils.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {EducationState, setQuery} from "@/app/modules/education/stores/education_slice.ts";

export type SearchOptionsProps = {
}

const SearchOptions = (props: SearchOptionsProps) => {
    const state = useAppSelector<EducationState>(c => c.education)
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
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    dispatch(setQuery({
                                                        ...state?.query,
                                                        Filters: [
                                                            ...state.query?.Filters?.filter(c => c.field !== "SpecialityPath") ?? [],
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

export default SearchOptions;