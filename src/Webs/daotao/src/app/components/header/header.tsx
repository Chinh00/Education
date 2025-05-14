import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import { Pin, ArrowLeft } from "lucide-react";
import {useLocation, useNavigate} from "react-router";
import {IconButton, Typography} from "@mui/material";
const Header = () => {
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    const nav = useNavigate();
    return (
        <div
            className={"grid grid-cols-12"}
        >
            <div className={"col-span-2 w-full h-full  p-4 flex justify-between items-center bg-[#0c458d] font-bold text-white text-2xl"}>
                {groupFuncName?.groupName} <Pin size={20} />
            </div>
            <div className={"col-span-10 p-4 relative w-full"}>
                <IconButton className={"z-50"} onClick={() => nav(-1)}><ArrowLeft /></IconButton>
                <Typography fontWeight={"bold"} className={"text-center absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}>{groupFuncName?.itemName ?? "Default"}</Typography>
            </div>
        </div>
    )
}

export default Header