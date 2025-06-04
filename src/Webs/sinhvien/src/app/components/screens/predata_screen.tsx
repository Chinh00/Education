import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"
import Lottie from "lottie-react";
import IconLoading from "@/assets/icons/Animation - 1745287432957.json";
import {ListCollapse, GraduationCap} from "lucide-react";
import {NavUser} from "@/app/components/navbar/nav-user.tsx";
import { IconButton } from "@mui/material";
import {useSidebar} from "@/app/components/ui/sidebar.tsx";

export type PredataScreenProps = {
  isLoading: boolean,
  isSuccess: boolean,
  children: ReactNode,
}

const PredataScreen = (props: PredataScreenProps) => {

  const { toggleSidebar } = useSidebar()
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
        className="w-full space-y-5"
      >
        <header className="sticky top-0 z-50 rounded-b-xl dark:border-gray-800  bg-transparent backdrop-blur-2xl dark:bg-gray-900 shadow-xl">
          <div className="mx-auto py-3 px-4">
            <div className="flex items-center gap-4 justify-between">
              <div>
                <IconButton onClick={toggleSidebar} className={" absolute right-0  w-min h-min"}>
                  <ListCollapse />
                </IconButton>
              </div>
              
              <NavUser/>

            </div>
          </div>
        </header>
        <div className={"p-5"}>
          {
            props.children
          }
        </div>



      </motion.div>}
      {props.isLoading && <div
        className={"absolute top-0 left-0 w-full z-50 flex justify-center items-center h-screen"}>
        <Lottie animationData={IconLoading} loop={true} className={"w-[200px]"} />

      </div>}

    </AnimatePresence>

  )
}
export default PredataScreen
