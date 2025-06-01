import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"
import Lottie from "lottie-react";
import IconLoading from "@/assets/icons/Animation - 1745287432957.json";
import {GraduationCap} from "lucide-react";
import {NavUser} from "@/app/components/navbar/nav-user.tsx";

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
        className="w-full p-5 pt-2 space-y-5"
      >
        <header className="sticky top-0 z-50 rounded-xl dark:border-gray-800 border-[1px] bg-transparent backdrop-blur-2xl dark:bg-gray-900 shadow-xl">
          <div className="mx-auto py-3 px-4">
            <div className="flex items-center gap-4 justify-between">

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-full animate-pulse opacity-50"></div>
                  <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                    <GraduationCap size={20} className="text-primary dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Thuỷ Lợi University
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trường đại học Thuỷ lợi</p>
                </div>
              </div>
              <NavUser/>

            </div>
          </div>
        </header>
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
