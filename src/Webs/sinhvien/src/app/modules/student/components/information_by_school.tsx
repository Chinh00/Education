import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card.tsx";
import {BookOpen, Building, Edit, School, Users} from "lucide-react";
import {Button} from "@/app/components/ui/button.tsx";
import {Avatar, AvatarFallback} from "@/app/components/ui/avatar.tsx";
import {InformationBySchool as InfoSchool} from "@/domain/information_by_school.model"
import {useGetCourses, useGetDepartments, useGetEducations} from "@/app/modules/common/hook.ts";
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/app/components/ui/select";
import {useEffect, useState} from "react";
import {Education} from "@/domain/education.ts";
import {Department} from "@/domain/department.ts";
export type InformationBySchoolProps = {
    educations: Education[],
    studentClassName: string
}

const InformationBySchool = (props: InformationBySchoolProps) => {
    const [selectedEducation, setSelectedEducation] = useState<Education>(props.educations[0])


    console.log()
    const {data: courses} = useGetCourses({
        Filters: [
            {
                field: "CourseCode",
                operator: "==",
                value: props?.educations[0]?.courseCode
            }
        ]
    })
    const {data: departments} = useGetDepartments({
        Filters: [
            {
                field: "Id",
                operator: "Contains",
                value: selectedEducation?.specialityPath.split(".")[0]!
            },
        ],
        Includes: ["Specialities"]
    }, !!props.educations[0])


    return (
        <>
            <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500 md:col-span-5 col-span-1">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg">
                            <Building className="mr-2 h-5 w-5 text-purple-500" />
                            Thông tin học tập
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>Thông tin liên quan đến trường học</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedEducation?.code} onValueChange={(value) => {
                        const edu = props?.educations?.find(e => e.code === value);
                        if (edu) setSelectedEducation(edu);
                    }}>
                        <SelectTrigger className={"w-full mb-5"} >
                            <SelectValue placeholder="Chương trình đào tạo" />
                        </SelectTrigger>
                        <SelectContent>
                            {!!props?.educations && props?.educations?.map((item, index) => (
                                <SelectItem value={item?.code} key={item?.code}>{item?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
                            <div className="flex items-center mb-3">
                                <div className="bg-blue-500 p-2 rounded-full mr-3">
                                    <Building className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-medium">Khoa</h3>
                            </div>
                            <p className="text-lg font-semibold">{departments?.data?.data?.items[0]?.departmentName}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
                            <div className="flex items-center mb-3">
                                <div className="bg-purple-500 p-2 rounded-full mr-3">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-medium">Chuyên ngành</h3>
                            </div>
                            {/*<p className="text-lg font-semibold">{props?.departments.specialities[Number(data?.data?.data?.items[0]?.specialityPath.split(".")[1]!)]?.specialityName}</p>*/}
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
                            <div className="flex items-center mb-3">
                                <div className="bg-green-500 p-2 rounded-full mr-3">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-medium">Lớp</h3>
                            </div>
                            <p className="text-lg font-semibold">{props?.studentClassName}</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-2">
                            <School className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="font-medium">Giáo viên cố vấn</h3>
                        </div>
                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3">
                                <AvatarFallback className="bg-blue-100 text-blue-600">{"student.advisor.charAt(0)"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{"student.advisor"}</p>
                                <p className="text-sm text-muted-foreground">Giáo viên cố vấn học tập</p>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">
                                Liên hệ
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>

        </>
    )
}

export default InformationBySchool