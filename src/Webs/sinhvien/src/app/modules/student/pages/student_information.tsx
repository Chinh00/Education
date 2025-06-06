import LayoutFadeIn from "@/app/components/layouts/layout_fadein";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {CircleUserRound, Clock, Edit, Share, Mail, GraduationCap} from "lucide-react";
import BadgeInformation from "../components/badge_information";
import { Typography } from "@mui/material";
import PersonalInformation from "../components/personal_information";
import Background from "@/assets/images/background.jpg"
import DefaultAvatar from "@/assets/images/avatar.png"
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import InformationBySchool from "@/app/modules/student/components/information_by_school.tsx";
import { motion } from "framer-motion"
const StudentInformation = () => {
  const { data, isPending, isSuccess } = useGetStudentInformation()




  return < >
    <PredataScreen isLoading={isPending} isSuccess={isSuccess}>
      <motion.div
        initial={{
          opacity: 0, y: -20
        }}
        transition={{ duration: 0.3 }}
        animate={{ opacity: 1, y: 0 }}
        className={"relative overflow-hidden w-full h-min p-0 border-2 border-gray-200 rounded-xl  box-shadow z-20"} style={{
        }}>
        <div className={'absolute bg-cover right-0 w-full h-full col-span-2 bg-no-repeat '}
          style={{
            backgroundImage: `url(${Background})`
          }}
        >
          <div className={"inset-0 md:bg-[linear-gradient(35deg,_white_0%,_white_45%,_transparent_100%)] bg-[linear-gradient(to_top,_white_0%,_white_45%,_transparent_100%)] pointer-events-none w-full h-full backdrop-blur-[1px]"}>

          </div>
        </div>
        <div className={"relative flex flex-col overflow-hidden w-full h-full z-20 py-10 md:flex-row gap-10"} >
          <div className={"flex justify-center content-center flex-col gap-3 md:pl-20 mx-auto "}>
            <Avatar className={"w-[200px] h-[200px] bg-white/80 md:bg-transparent shadow-xl ring-4 ring-blue-500/30 border-4"} >
              <AvatarImage src={DefaultAvatar} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Button variant={"outline"}>
              <Edit />
              Cập nhật ảnh
            </Button>
          </div>
          <div className={"flex flex-col w-full justify-center content-center h-full gap-4"}>
            <Typography className={"text-center md:text-left"} fontSize={"large"} fontWeight={"bold"}>{data?.data?.data?.personalInformation?.fullName}</Typography>
            <BadgeInformation index={0} text={`Mã sinh viên: ${data?.data?.data?.informationBySchool?.studentCode}`} icon={<CircleUserRound color={"gray"} size={20} className={"border-none border-0"} />} />
            <BadgeInformation index={1} text={"Đang học"} icon={<Clock color={"gray"} size={20} />} className={" bg-green-200 border-none"} />
            <BadgeInformation index={2} text={data?.data?.data?.personalInformation?.officeEmail} icon={<Mail color={"gray"} size={20} />} />
            <BadgeInformation index={3} text={data?.data?.data?.educationPrograms[0]?.name} icon={<GraduationCap color={"gray"} size={20} />}/>

          </div>
        </div>

        <div className={"absolute top-0 right-0 md:p-5 p-3  z-20"}>
          <Button className={"bg-white/80 inset-0 backdrop-blur-[1px] cursor-pointer"} variant={"outline"}>
            <Share />
            Chia sẻ
          </Button>
        </div>
      </motion.div>
      <div className={"grid md:grid-cols-5 gap-5 grid-cols-1 w-full mt-10"}>
        <PersonalInformation personalInformation={data?.data?.data?.personalInformation} />
        <InformationBySchool educations={data?.data?.data?.educationPrograms ?? []} />
      </div>




    </PredataScreen>
  </>
}
export default StudentInformation;
