import {Select} from "antd"
import {useState} from "react";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";


export type SemesterSelectProps = {
    valueSelected: string,
    onChange: (selected: string) => void,
}

const SemesterSelect = (props: SemesterSelectProps) => {
    const [open, setOpen] = useState(false)
    const {data, isLoading, isSuccess} = useGetSemesters({
        Sorts: ["IdDesc"],
        Filters: [
            {
                field: "ParentSemesterCode",
                operator: "In",
                value: ","
            }
        ]
    }, open)

    return (
        <>
            <Select
                open={open}
                loading={isLoading}
                style={{
                    minWidth: 200
                }}
                onChange={(value, option) => {
                    props?.onChange?.(value)
                }}
                onClick={() => {
                    setOpen(prevState => !prevState)
                }}
                placeholder={"Chọn kì học"}
            >
                {!!data && data?.data?.data?.items?.map(c => {
                    return <Select.Option value={c?.semesterCode} key={c?.semesterCode}>{c?.semesterName}</Select.Option>
                })}
            </Select>
        </>
    )
}

export default SemesterSelect;