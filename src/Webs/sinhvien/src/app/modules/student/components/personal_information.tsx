import PersonalInformation from "@/domain/personal_information.model"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,


} from "@/app/components/ui/card"
import {BookOpen, Building, Calendar, Edit, Flag, Home, Mail, Phone, School, User, UserCircle, Users, Verified } from "lucide-react"
import { Button } from "@/app/components/ui/button"

import dayjs from "dayjs"

export interface PersonalInformationProps {
    personalInformation?: PersonalInformation
}


const PersonalInformation = (props: PersonalInformationProps) => {


    return (
        <>
            <Card className={"p-5 md:col-span-3 col-span-1 hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500"}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                            <User className="mr-2 h-5 w-5 text-blue-500" />
                            Thông tin cơ bản
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Thông tin cá nhân của sinh viên</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Họ và tên</h3>
                                    <p className="font-medium">{props?.personalInformation?.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-purple-100 p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                                    <UserCircle className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Dân tộc</h3>
                                    <p className="font-medium">{props?.personalInformation?.ethnic}</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Ngày sinh</h3>
                                    <p className="font-medium">{dayjs(props?.personalInformation?.birthDate).format("DD-MM-YYYY")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-yellow-100 p-2 rounded-full group-hover:bg-yellow-200 transition-colors">
                                    <Users className="h-4 w-4 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Giới tính</h3>
                                    <p className="font-medium">{props?.personalInformation?.gender ? "Nam" : "Nữ" }</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-red-100 p-2 rounded-full group-hover:bg-red-200 transition-colors">
                                    <Verified className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Số CMND/CCCD</h3>
                                    <p className="font-medium">{props?.personalInformation?.idNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-start group">
                                <div className="mr-3 mt-0.5 bg-orange-100 p-2 rounded-full group-hover:bg-orange-200 transition-colors">
                                    <Flag className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Quốc tịch</h3>
                                    <p className="font-medium">{"Việt Nam"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-green-500 md:col-span-2 col-span-1">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                            <Phone className="mr-2 h-5 w-5 text-green-500" />
                            Thông tin liên hệ
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Thông tin liên lạc của sinh viên</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start group">
                            <div className="mr-3 mt-0.5 bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
                                <Home className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-muted-foreground">Địa chỉ sống</h3>
                                <p className="font-medium">{props?.personalInformation?.currentLive}</p>
                            </div>
                        </div>
                        <div className="flex items-start group">
                            <div className="mr-3 mt-0.5 bg-purple-100 p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                                <Mail className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                                <p className="font-medium">{props?.personalInformation?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start group">
                            <div className="mr-3 mt-0.5 bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                                <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm text-muted-foreground">Số điện thoại</h3>
                                <p className="font-medium">{props?.personalInformation?.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Gửi email
                    </Button>
                </CardFooter>
            </Card>
        </>
            
    )
}

export default PersonalInformation