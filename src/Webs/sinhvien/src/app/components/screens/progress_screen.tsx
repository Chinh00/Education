import {useEffect, useState} from "react";
import {Progress} from "@/app/components/screens/progress.tsx";
import {GraduationCap} from "lucide-react";
import TluIcon from "@/assets/icons/tlu_icon.png";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setPageLoaded} from "@/app/stores/common_slice.ts";

const ProgressScreen = () => {
    const [progress, setProgress] = useState(0)
    const {pageLoaded} = useAppSelector<CommonState>(c => c.common)
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setPageLoaded(true))
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 3
                return newProgress >= 100 ? 100 : newProgress
            })
            return () => {
                clearInterval(interval)
            }
        }, 100)

    }, []);
    useEffect(() => {
        if (!pageLoaded) {
            setProgress(100)
        }
    }, [pageLoaded]);


    return (
        <>
            <div className="fixed top-0 left-0 inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 w-full h-full">
                <img src={TluIcon} alt="tlu" className={"scale-50"}/>
                <div className="w-64 mb-8">
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center gap-3">
                    <GraduationCap size={28} className="text-primary animate-pulse" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        TLU Course Registration
                    </h1>
                </div>
            </div>
        </>
    )
}
export default ProgressScreen