import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setCurrentSemester} from "@/app/stores/common_slice.ts";
import { Pin, ArrowLeft } from "lucide-react";
import {useLocation, useNavigate} from "react-router";
import {IconButton, Typography} from "@mui/material";
import {Select} from "antd";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useEffect} from "react";
const Header = () => {
    const {groupFuncName, currentParentSemester, currentChildSemester} = useAppSelector<CommonState>(c => c.common)
    const nav = useNavigate();
    const dispatch = useAppDispatch()
    
    const {data: semesters, isLoading} = useGetSemesters({
        Sorts: ["CreatedAtDesc"],
        Page: 1,
        PageSize: 100
    })

    useEffect(() => {
        if (semesters && semesters?.data?.data?.items?.length > 0) {
            dispatch(setCurrentSemester({
                parentSemester: semesters?.data?.data?.items?.find(e => e.parentSemesterCode === null && e.semesterStatus !== 3),
                childSemesters: semesters?.data?.data?.items?.filter(e => e.parentSemesterCode === semesters?.data?.data?.items?.find(e => e.parentSemesterCode === null && e.semesterStatus !== 3)?.semesterCode)
            }))
        }
    }, [semesters]);
    
    return (
        <div
            className={"grid grid-cols-12 bg-transparent backdrop-blur-2xl"}
        >
            <div className={"col-span-2 w-full h-full  p-4 flex justify-between items-center  font-bold text-2xl"}>
                {groupFuncName?.groupName} <Pin size={20} />
            </div>
            <div className={"col-span-10 p-4 relative w-full"}>
                {/*<IconButton className={"z-50"} onClick={() => nav(-1)}><ArrowLeft /></IconButton>*/}
                <div className={"z-50"}>
                    <Select
                        value={currentParentSemester?.semesterCode}    
                        loading={isLoading} className={"min-w-[300px]"} size={"large"} style={{borderColor: "black"}} placeholder={"Danh sách kì học"}>
                        {semesters && semesters?.data?.data?.items?.filter(e => e.parentSemesterCode === null)?.map((semester) => (
                            <Select.Option
                                disabled={semester?.semesterStatus === 3}
                                key={semester?.semesterCode} 
                                value={semester?.semesterCode}
                                children={<>
                                    Kì học: {semester?.semesterName}
                                    <span className={`ml-2 text-[12px] font-bold ${semester?.semesterStatus !== 3 && "text-blue-500"}`}>({semester?.semesterStatus === 3 ? "Đã kết thúc" : "Đang diễn ra"})</span>
                                </>}
                            />
                        ))}
                        
                    </Select>
                </div>
                <Typography fontWeight={"bold"} className={"text-center absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>{groupFuncName?.itemName ?? "Default"}</Typography>
            </div>
        </div>
    )
}

export default Header