import {useEffect, useState} from "react";
import TluIcon from "@/asssets/icons/tlu_icon.png";
import {Progress} from "@/app/components/screens/progress.tsx";
import {GraduationCap} from "lucide-react";

const TabLoading = () => {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
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

    return (
        <>
            <div className="fixed z-50 top-0 left-0 inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 w-full h-full">
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
export default TabLoading