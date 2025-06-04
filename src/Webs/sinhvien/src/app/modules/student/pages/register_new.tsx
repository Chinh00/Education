import PredataScreen from "@/app/components/screens/predata_screen"
import {Box} from "@mui/material";
import {useGetEducations, useGetSubjects} from "@/app/modules/common/hook.ts";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import useGetStudentSemesters from "@/app/modules/student/hooks/useGetStudentSemesters.ts";
import {Button, Card, Space, Spin, Typography} from "antd"
import { Badge } from "@/app/components/ui/badge";
import {
    useGetRegisterCourseClass,
    useGetRegisterCourseClassBySubjectCode
} from "@/app/modules/student/hooks/useGetRegisterCourseClass.ts";
import {useState} from "react";
import CourseClassCard from "@/app/modules/student/components/course_class_card.tsx";

const RegisterNew = () => {

    const {data, isPending, isSuccess} = useGetStudentInformation()

    const {data: results} = useGetStudentSemesters({
        Includes: ["SubjectResults"]
    })

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
    const {data: courseClasses} = useGetRegisterCourseClassBySubjectCode(selectedSubject!, selectedSubject !== undefined)

    const {data: registerCourseClass} = useGetRegisterCourseClass()
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"grid grid-cols-8 text-sm gap-5"}>
                <div className={"w-full col-span-8  gap-5"}>
                    <Typography.Title level={4} className={"text-center flex items-center justify-center gap-5"}>Các môn học đăng ký học kì
                        <Badge className={"bg-blue-500 text-xl"}>{registerCourseClass?.data?.data?.semesterCode}</Badge>
                    </Typography.Title>
                </div>
                <div className={"col-span-2 border-2 rounded-xl shadow-xl" }>
                    {subjects && subjects?.data?.data?.items?.filter(e => !subjectCodes?.includes(e.subjectCode))?.map(e => (
                        <Button type={"text"} onClick={( ) => setSelectedSubject(e?.subjectCode)} key={e.subjectCode} className={"flex w-full items-center justify-between p-2 border-b cursor-pointer"}>
                            {e?.subjectName}
                        </Button>
                    ))}
                    {subjectsLoading && <Space className={"w-full flex justify-center items-center "}>
                        <Spin size={"large"} />
                    </Space>}
                    
                </div>
                <Card className={"col-span-6"}>
                    {courseClasses && courseClasses?.data?.data?.items?.map(e => (
                        <CourseClassCard courseClass={e} key={e.courseClassCode} />
                    ))}
                </Card>
            </Box>
        </PredataScreen>
    )
}

export default RegisterNew