import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import { Pin } from "lucide-react";

const Header = () => {
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    return (
        <div
            className={"grid grid-cols-12"}
        >
            <div className={"col-span-2 w-full h-full border-r-2 p-4 flex justify-between items-center"}>
                {groupFuncName?.groupName} <Pin size={20} />
            </div>
            <div className={"col-span-10 p-4"}>
                {groupFuncName?.itemName ?? "asdas"}
            </div>
        </div>
    )
}

export default Header