import {Select} from "antd"
import {useState} from "react";
import { useGetSemesters } from "../hooks/useGetSemesters.ts";


export type SemesterSelectProps = {

}

const SemesterSelect = (props: SemesterSelectProps) => {
    const [open, setOpen] = useState(false)
    const {data, isLoading, isSuccess} = useGetSemesters({}, open)

    return (
        <>
            <Select
                open={open}
                loading={isLoading}
                style={{
                    minWidth: 200
                }}
                onChange={(value, option) => {
                    console.log(value)
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