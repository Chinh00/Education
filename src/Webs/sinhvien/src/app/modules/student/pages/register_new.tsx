import PredataScreen from "@/app/components/screens/predata_screen"
import {Box} from "@mui/material";
import {useGetEducations, useGetSubjects} from "@/app/modules/common/hook.ts";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import useGetStudentSemesters from "@/app/modules/student/hooks/useGetStudentSemesters.ts";
import {Button, Card, Space, Spin, Tooltip, Typography} from "antd"
import { Badge } from "@/app/components/ui/badge";
import {
    useGetRegisterCourseClass,
    useGetRegisterCourseClassBySubjectCode
} from "@/app/modules/student/hooks/useGetRegisterCourseClass.ts";
import React, {useEffect, useState} from "react";
import CourseClassCard from "@/app/modules/student/components/course_class_card.tsx";
import {Input} from "antd"
import { groupCourseClassesWithLodash } from "@/domain/course_class";
import {useCreateStudentRegisterCourseClass} from "@/app/modules/student/hooks/useCreateStudentRegisterCourseClass.ts";
import toast from "react-hot-toast";
import {useGetStudentRegisterCourseClass} from "@/app/modules/student/hooks/useGetStudentRegisterCourseClass.ts";
import {useGetSemesters} from "@/app/modules/student/hooks/useGetSemester.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select.tsx";


const RegisterNew = () => {
    const [selectedEducation, setSelectedEducation] = useState<string>()

    const {data, isPending, isSuccess} = useGetStudentInformation()
    useEffect(() => {
        if (data) {
            setSelectedEducation(data?.data?.data?.educationPrograms[0]?.code)
        }
    }, [data]);
    const {data: results} = useGetStudentSemesters({
        Includes: ["SubjectResults"]
    })
    
    
    
    const {data: studentRegister, refetch} = useGetStudentRegisterCourseClass()

    const {data: educations, isPending: educationsLoading} = useGetEducations({
        Filters: [
            {
                field: "Code",
                operator: "==",
                value: data?.data?.data?.educationPrograms?.map(c => c.code).join(",")!
            }
        ],
        Includes: ["EducationSubjects"]
    }, isSuccess)

    const {data: subjects, isLoading: subjectsLoading, isSuccess: subjectsSuccess} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "In",
                value: educations?.data?.data?.items?.[0]?.educationSubjects?.join(",")!
            }
        ],
        Includes: ["IsCalculateMark"],
        Page: 1,
        PageSize: 1000
    }, educations?.data?.data?.items?.[0] !== undefined)
    const subjectCodes = results?.data?.data?.items?.flatMap(c =>
        c.subjectResults?.map(e => e.subjectCode) ?? []
    ) ?? [];

    const [selectedSubject, setSelectedSubject] = useState<string>()
    const {data: courseClasses, isLoading: courseClassLoading, refetch: courseClassRefectch} = useGetRegisterCourseClassBySubjectCode(selectedSubject!, selectedSubject !== undefined)

    const {data: registerCourseClassState} = useGetRegisterCourseClass()
    const [searchValue, setSearchValue] = useState<string>("");

    
    
    
    
    const {mutate, isPending: loading} = useCreateStudentRegisterCourseClass()
    const courseClassCodeRegister = studentRegister?.data?.data?.courseClassCode
    const {data: semesters} = useGetSemesters({
        Filters: [
            {
                field: "SemesterStatus",
                operator: "In",
                value: "0,1"
            }
        ],
    }, registerCourseClassState?.data?.data?.semesterCode !== undefined)
    
    const courseClassRegisterd = courseClasses?.data?.data?.items?.filter(e => courseClassCodeRegister?.includes(e.courseClassCode!)) ?? [];
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <div className={"grid grid-cols-12 gap-4 py-5"}>
                <Typography.Title level={5} className={"text-center whitespace-nowrap col-span-2"}>Chương trình đào tạo</Typography.Title>
                <div className={"col-span-10"}>
                    <Select  value={selectedEducation} onValueChange={(value) => {
                        const edu = data?.data?.data?.educationPrograms?.find(e => e.code === value);
                        if (edu) setSelectedEducation(edu?.code);
                    }}>
                        <SelectTrigger className={"w-full"} >
                            <SelectValue placeholder="Chương trình đào tạo" />
                        </SelectTrigger>
                        <SelectContent>
                            {!!data && data?.data?.data?.educationPrograms?.map((item, index) => (
                                <SelectItem value={item?.code} key={item?.code}>{item?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Typography.Title level={4} className={"text-center col-span-2"}>Học kì
                </Typography.Title>
                <Badge className={"bg-blue-500 text-md col-span-10"}>
                    
                    {semesters?.data?.data?.items?.find(e => e.parentSemesterCode === null!)?.semesterCode}
                </Badge>
                
            </div>
            <Box className={"grid grid-cols-8 text-sm gap-5"}>
                
                
                <Card className={"col-span-2  max-h-screen overflow-y-scroll relative" }>
                    <Input.Search
                        className={"sticky top-5"}
                        placeholder="Tìm kiếm theo tên môn học..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        allowClear
                    />
                    {subjects && subjects?.data?.data?.items?.map(e => (
                        <div  onClick={( ) => setSelectedSubject(e?.subjectCode)} key={e.subjectCode} className={"flex w-full items-center justify-between p-2 border-b cursor-pointer"}>
                            {e?.subjectName}
                        </div>
                    ))}
                    {subjectsLoading && <Space className={"w-full flex justify-center items-center "}>
                        <Spin size={"large"} />
                    </Space>}
                    
                </Card>
                <Card className={"col-span-6 "}>
                    <div className={"bg-blue-500 text-white  rounded-sm"}>
                        <Typography.Title style={{color: "white"}} level={4}  className={"text-left px-2 py-3"}>
                            Các lớp học của môn học: {
                            subjects?.data?.data?.items?.find(e => e.subjectCode === selectedSubject)?.subjectName
                        }
                        </Typography.Title>
                        
                    </div>
                    
                    
                    
                    {courseClassLoading && (
                        <Space className={"w-full flex justify-center items-center mt-5"}>
                            <Spin size={"large"} />
                        </Space>
                    )}
                    {!courseClassLoading && courseClasses && (
                        groupCourseClassesWithLodash(courseClasses?.data?.data?.items)?.length === 0 ? (
                            <div className={"flex flex-col items-center justify-center h-full"}>
                                <Typography.Text className={"text-gray-500"}>Không có lớp học nào được tìm thấy</Typography.Text>
                            </div>
                        ) : (
                            groupCourseClassesWithLodash(courseClasses?.data?.data?.items, courseClassRegisterd)?.filter(e => e.stage !== 4).map(e => (
                                <CourseClassCard loading={loading}  courseClassRegister={courseClassCodeRegister ?? []} onClick={(courseClassCode) => {
                                    mutate({
                                        courseClassCode: courseClassCode ,
                                        semesterCode: registerCourseClassState?.data?.data?.semesterCode!,
                                        subjectCode: selectedSubject!
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Đăng ký lớp học thành công lớp học: " + e.courseClassCode);
                                            courseClassRefectch();
                                            refetch()
                                        }
                                    })
                                }} courseClass={e} key={e.courseClassCode} />
                            ))
                        )
                    )}
                </Card>
            </Box>
        </PredataScreen>
    )
}

export default RegisterNew