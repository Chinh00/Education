import LayoutFadeIn from "@/app/components/layouts/layout_fadein";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import { Card } from "@/app/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {CircleUserRound, Clock, Edit, Share, Mail } from "lucide-react";
import BadgeInformation from "../components/badge_information";
import { Typography } from "@mui/material";
import PersonalInformation from "../components/personal_information";
import Background from "@/assets/images/background.jpg"
import DefaultAvatar from "@/assets/images/avatar.png"
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import InformationBySchool from "@/app/modules/student/components/information_by_school.tsx";
const StudentInformation = () => {
    const {data, isPending, isSuccess} = useGetStudentInformation()




    return <LayoutFadeIn >
        <PredataScreen isLoading={isPending} isSuccess={isSuccess}>
            <Card className={"relative overflow-hidden w-full h-full p-0"} style={{
            }}>
                <div className={'absolute bg-cover right-0 w-full h-[300px] col-span-2 bg-no-repeat '}
                    style={{
                        backgroundImage: `url(${Background})`
                    }}
                >
                    <div className={"inset-0 md:bg-[linear-gradient(35deg,_white_0%,_white_45%,_transparent_100%)] bg-[linear-gradient(to_top,_white_0%,_white_45%,_transparent_100%)] pointer-events-none w-full h-full backdrop-blur-[1px]"}>

                    </div>
                </div>
                <div className={"relative flex flex-col overflow-hidden w-full h-full z-50 py-10 md:flex-row gap-10"} >
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
                    <div className={"flex flex-col w-full justify-center content-center h-full gap-2"}>
                        <Typography className={"text-center md:text-left"} fontSize={"large"} fontWeight={"bold"}>{data?.data?.data?.personalInformation?.fullName}</Typography>
                        <BadgeInformation text={`Mã sinh viên: ${data?.data?.data?.informationBySchool?.studentCode}`} icon={<CircleUserRound color={"gray"} size={20} className={"border-none border-0"}/>} />
                        <BadgeInformation text={"Đang học"} icon={<Clock color={"gray"} size={20} />} className={" bg-green-200 border-none"}/>
                        <BadgeInformation text={data?.data?.data?.personalInformation?.officeEmail} icon={<Mail color={"gray"} size={20} />} />
                        {/*<BadgeInformation text={"Công nghệ thông tin"} icon={<GraduationCap color={"gray"} size={20} />}/>*/}

                    </div>
                </div>

                <div className={"absolute top-0 right-0 md:p-5 p-3  z-50"}>
                    <Button className={"bg-white/80 inset-0 backdrop-blur-[1px] cursor-pointer"} variant={"outline"}>
                        <Share />
                        Chia sẻ
                    </Button>
                </div>
            </Card>
            {/*<Tabs className={"w-full py-5"} defaultValue="personal" >*/}
            {/*    <TabsList className="grid grid-cols-3 w-full flex-wrap" >*/}
            {/*        <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>*/}
            {/*        <TabsTrigger value="school">Kết quả học tập</TabsTrigger>*/}
            {/*        <TabsTrigger value="result">Chương trình đào tạo</TabsTrigger>*/}
            {/*        */}
            {/*    </TabsList>*/}
            {/*    <TabsContent value={"personal"} >*/}
            {/*    </TabsContent>*/}
            {/*</Tabs>*/}
            <div className={"grid md:grid-cols-5 gap-5 grid-cols-1 w-full mt-10"}>
                <PersonalInformation personalInformation={data?.data?.data?.personalInformation} />
                <InformationBySchool educations={data?.data?.data?.educationPrograms ?? []}  />
            </div>



        </PredataScreen>
    </LayoutFadeIn>
}
export default StudentInformation;