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
import {useState} from "react";
import CourseClassCard from "@/app/modules/student/components/course_class_card.tsx";
import {Input} from "antd"
import { groupCourseClassesWithLodash } from "@/domain/course_class";
import {useCreateStudentRegisterCourseClass} from "@/app/modules/student/hooks/useCreateStudentRegisterCourseClass.ts";
import toast from "react-hot-toast";
import {useGetStudentRegisterCourseClass} from "@/app/modules/student/hooks/useGetStudentRegisterCourseClass.ts";


const RegisterNew = () => {

    const {data, isPending, isSuccess} = useGetStudentInformation()

    const {data: results} = useGetStudentSemesters({
        Includes: ["SubjectResults"]
    })
    const {data: studentRegister} = useGetStudentRegisterCourseClass()

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
    const {data: courseClasses, isLoading: courseClassLoading} = useGetRegisterCourseClassBySubjectCode(selectedSubject!, selectedSubject !== undefined)

    const {data: registerCourseClass} = useGetRegisterCourseClass()
    const [searchValue, setSearchValue] = useState<string>("");

    
    const filteredSubjects = subjects?.data?.data?.items
        ?.filter(e => !subjectCodes?.includes(e.subjectCode))
        ?.filter(e =>
            e.subjectName?.toLowerCase().includes(searchValue.trim().toLowerCase())
        ) ?? subjects?.data?.data?.items;
    
    
    const {mutate} = useCreateStudentRegisterCourseClass()
    const courseClassCodeRegister = studentRegister?.data?.data?.courseClassCode


    const [selectedStage, setSelectedStage] = useState(0)    
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"grid grid-cols-8 text-sm gap-5"}>
                <div className={"w-full col-span-8  gap-5"}>
                    <Typography.Title level={4} className={"text-center flex items-center justify-center gap-5"}>Các môn học đăng ký học kì
                        <Badge className={"bg-blue-500 text-xl"}>{registerCourseClass?.data?.data?.semesterCode}</Badge>
                    </Typography.Title>
                </div>
                
                <Card className={"col-span-2  max-h-screen overflow-y-scroll relative" }>
                    <Input.Search
                        className={"sticky top-5"}
                        placeholder="Tìm kiếm theo tên môn học..."
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        allowClear
                    />
                    {filteredSubjects && filteredSubjects.map(e => (
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
                    <div className={"flex flex-row gap-3 space-y-3"}>
                        <Button
                            onClick={() => setSelectedStage(0)}
                            size={"small"} type={selectedStage === 0 ? "primary" : "dashed"} color={"geekblue"}>Giai đoạn 1</Button>
                        <Button
                            onClick={() => setSelectedStage(1)}
                            size={"small"} type={selectedStage === 1 ? "primary" : "dashed"}  color={"geekblue"}>Giai đoạn 2</Button>
                        <Button
                            onClick={() => setSelectedStage(2)}
                            size={"small"} type={selectedStage === 2 ? "primary" : "dashed"}  color={"geekblue"}>Cả 2 giai đoạn</Button>

                    </div>
                    
                    
                    {courseClassLoading && (
                        <Space className={"w-full flex justify-center items-center mt-5"}>
                            <Spin size={"large"} />
                        </Space>
                    )}
                    {!courseClassLoading && courseClasses && (
                        groupCourseClassesWithLodash(courseClasses?.data?.data?.items?.filter(e => e.stage === selectedStage) ?? []).length === 0 ? (
                            <div className={"flex flex-col items-center justify-center h-full"}>
                                <Typography.Text className={"text-gray-500"}>Không có lớp học nào được tìm thấy</Typography.Text>
                            </div>
                        ) : (
                            groupCourseClassesWithLodash(courseClasses?.data?.data?.items.filter(e => e.stage === selectedStage) ?? []).map(e => (
                                <CourseClassCard isLabRegister={courseClassCodeRegister?.includes(e.courseClassCode)} isLectureRegister={courseClassCodeRegister?.includes(e.courseClassCode)} onClick={(courseClassCode) => {
                                    mutate({
                                        courseClassCode: courseClassCode,
                                        semesterCode: registerCourseClass?.data?.data?.semesterCode!,
                                        subjectCode: selectedSubject!
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Đăng ký lớp học thành công lớp học: " + e.courseClassCode);
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