import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";

const RegisterTimeline = () => {
    const {semester} = useParams()
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Thời khóa biểu học kì ${semester}`}));
    }, []);
    return (
        <>

        </>
    )
}
export default RegisterTimeline;