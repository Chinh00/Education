import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import { setStudentListSearch, StudentState} from "@/app/modules/student/stores/student_slice.ts";
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
import {useGetClasses} from "@/app/modules/class/hooks/useGetClasses.ts";
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";
import {Query} from "@/infrastructure/query.ts";

const ClassSearch = () => {
    const {studentListSelected} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [educationQuery, setEducationQuery] = useState<Query>({})
    const {data: educationData, isSuccess: educationSuccess} = useGetEducations(educationQuery)
    useEffect(() => {
        if (studentListSelected?.specialityCode) {
            setEducationQuery(prevState => ({
                ...prevState,
                Filters: [
                    {
                        field: "SpecialityCode",
                        operator: "==",
                        value: studentListSelected?.specialityCode!
                    }
                ]
            }))
        }
    }, [studentListSelected?.specialityCode]);

    useEffect(() => {
        if (educationData?.data?.data?.items?.length ?? 0 > 0) {
            setClassQuery(prevState => ({...prevState,
                Filters: [
                    {
                        field: "EducationCode",
                        operator: "In",
                        value: educationData?.data?.data?.items?.map(c => c?.code).join(",")!,
                    },
                ]
            }))
        }
    }, [educationData]);
    useEffect(() => {
        if (studentListSelected?.courseCode) {
            setEducationQuery(prevState => ({...prevState,
                Filters: [
                    {
                        field: "CourseCode",
                        operator: "==",
                        value: studentListSelected?.courseCode!,
                    },
                ]
            }))
        }
    }, [studentListSelected?.courseCode]);

    const [classQuery, setClassQuery] = useState<Query>({
        Page: 1,
        PageSize: 10000
    })

    const { data, isPending, isSuccess} = useGetClasses(classQuery, educationSuccess)


    useEffect(() => {
        if (value) {
            dispatch(setStudentListSearch({...studentListSelected, classCode: value}))
        }
    }, [value]);





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
                            ? data?.data?.data?.items.find((item) => item.classCode === value)?.className
                            : "Lớp học"}
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
                                                key={item.classCode}
                                                value={item.classCode}
                                                onSelect={(currentValue) => {
                                                    setValue(item.classCode)

                                                    setOpen(false)
                                                }}
                                            >
                                                {item.className}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === item.classCode ? "opacity-100" : "opacity-0"
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

export default ClassSearch;