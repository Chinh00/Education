import {useGetCourses} from "@/app/modules/common/hook.ts";
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
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {setQuery} from "@/app/modules/student/stores/student_slice.ts";
import {useState} from "react";
import { StudentState } from "../stores/student_slice";
import {useGetEducations} from "@/app/modules/education/hooks/useGetEducations.ts";

export type CourseSearchProps = {
}

const CourseSearch = (props: CourseSearchProps) => {
    const {query} = useAppSelector<StudentState>(c => c.student)
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false)

    const [courseQuery, setCourseQuery] = useState<Query>({

    })





    const {data: courses, isPending, isSuccess} = useGetCourses(courseQuery, open)

    const [value, setValue] = useState("")
    const {data: educations, isSuccess: educationSuccess} = useGetEducations({
        Filters: [
            {
                field: "CourseCode",
                operator: "==",
                value: value
            }
        ]
    },  !!value, (data) => {
        dispatch(setQuery({
            ...query,
            Filters: [
                ...query?.Filters?.filter(c => c.field != "EducationCodes") ?? [],
                {
                    field: 'InformationBySchool.EducationCodes',
                    operator: "In",
                    value: data?.data?.data?.items?.map(c => c.code).join(",")!
                }
            ]
        }))
    })
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
                            ? courses?.data?.data?.items?.find((item) => item.courseCode === value)?.courseCode
                            : "Chọn khoá học"}
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
                                    !!courses && courses?.data?.data?.items?.map((item) => {
                                        return (
                                            <CommandItem
                                                key={item.id}
                                                value={item.courseCode}
                                                onSelect={(currentValue) => {
                                                    setValue(item.courseCode)
                                                    setOpen(false)
                                                }}
                                            >
                                                {item.courseName}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === item.courseCode ? "opacity-100" : "opacity-0"
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

export default CourseSearch