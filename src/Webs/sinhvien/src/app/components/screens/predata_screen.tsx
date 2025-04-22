import {AnimatePresence, motion} from "framer-motion"
import { ReactNode } from "react"
import Lottie from "lottie-react";
import IconLoading from "@/assets/icons/Animation - 1745287432957.json";

export type PredataScreenProps = {
    isLoading: boolean,
    isSuccess: boolean,
    children: ReactNode,
}

const PredataScreen = (props: PredataScreenProps) => {
    return (
        <AnimatePresence>
            {props.isSuccess && <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                exit={{
                    opacity: 0,
                }}
                transition={{
                    duration: 0.45
                }}
            >
                {
                    props.children
                }



            </motion.div>}
            {props.isLoading && <div
                className={"absolute top-0 left-0 w-full z-50 flex justify-center items-center h-screen"}>
                <Lottie animationData={IconLoading} loop={true} className={"w-[200px]"} />

            </div>}

        </AnimatePresence>

    )
}
export default PredataScreen