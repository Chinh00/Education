import { motion } from "framer-motion"
import {
  Card
} from "@/app/components/ui/card.tsx"
import _ from "lodash";
import { Badge } from "@/app/components/ui/badge"
import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import { useParams } from "react-router";
import StatsCard from "../components/stats_card";
import { useGetSemesters } from "@/app/modules/student/hooks/useGetSemester.ts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/app/components/ui/carousel.tsx"
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { useEffect, useState } from "react";
import useGetStudentSemesters from "@/app/modules/student/hooks/useGetStudentSemesters.ts";
import { Query } from "@/infrastructure/query.ts";
import GradeCard from "../components/grade_card";
import { SubjectResult } from "@/domain/subject_result.ts";
import {useGetEducations} from "@/app/modules/common/hook.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select.tsx";
const EducationResult = () => {

  
  const { data, isLoading: studentLoading, isSuccess: studentSuccess } = useGetStudentInformation();

  const { data: educations, isLoading: educationsLoading } = useGetEducations({
    Filters: [
      {
        field: "Code",
        operator: "In",
        value: data?.data?.data?.educationPrograms?.map(c => c.code).join(",")!
      }
    ],
    Includes: ["EducationSubjects"]
  }, studentSuccess)
  
  const { data: semesters, isLoading: semesterLoading, isSuccess: semestersSuccess } = useGetSemesters({});

  const [selectSemester, setSelectSemester] = useState<string>()

  useEffect(() => {
    const semesterCode = semesters?.data?.data?.items?.filter(c => c?.semesterCode?.includes(`${data?.data?.data?.informationBySchool?.yearOfHighSchoolGraduation}`))[2]?.semesterCode
    setSelectSemester(semesterCode)
  }, [semesters]);

  useEffect(() => {
    if (selectSemester) {
      setQuery(prevState => ({
        ...prevState,
        Filters: [
          ...prevState.Filters?.filter(c => c.field !== "SemesterCode") ?? [],
          {
            field: "SemesterCode",
            operator: "==",
            value: selectSemester,
          }
        ]
      }))
    }
  }, [selectSemester]);


  const [query, setQuery] = useState<Query>({
    Includes: ["SubjectResults"]
  })
  const { data: studentSemester } = useGetStudentSemesters(query, query?.Filters?.filter(c => c.field !== "SemesterCode") !== undefined)

  const [selectedEducation, setSelectedEducation] = useState("")

  const [summary, setSummary] = useState<{gpa: number, credits: number, subject: number}>()

  useEffect(() => {
    // Kiểm tra nếu có dữ liệu studentSemester
    const subjectResults: SubjectResult[] = studentSemester?.data?.data?.items[0]?.subjectResults || [];
    if (!subjectResults.length) {
      setSummary({ gpa: 0, credits: 0, subject: 0 });
      return;
    }
    // Group theo mã môn học, lấy điểm cao nhất mỗi môn
    const grouped = _.groupBy(subjectResults, "subjectCode");
    const bestResults = Object.values(grouped).map(
        (group) => group.reduce((best, curr) => (curr.mark > best.mark ? curr : best), group[0])
    );
    // Tổng tín chỉ
    const totalCredits = bestResults.reduce((sum, item) => sum + item.numberOfCredits, 0);
    const totalSubjects = bestResults.length;
    // GPA (trung bình gia quyền)
    const gpa =
        totalCredits > 0
            ? bestResults.reduce((sum, item) => sum + item.mark * item.numberOfCredits, 0) / totalCredits
            : 0;
    setSummary({
      gpa: Number(gpa.toFixed(2)),
      credits: totalCredits,
      subject: totalSubjects,
    });
  }, [studentSemester]);
  
  return (
    <PredataScreen isLoading={studentLoading} isSuccess={studentSuccess} >
      <div className="min-h-screen  p-4 md:p-6 ">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Program Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/*<Card className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-xl overflow-hidden relative">*/}
            {/*  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-3xl"></div>*/}
            {/*  <div className="relative flex items-center justify-between flex-wrap gap-4">*/}
            {/*    <div>*/}
            {/*      <h2 className="text-2xl font-bold">{data?.data?.data?.educationPrograms?.filter(c => c.code === id)[0]?.name}</h2>*/}
            {/*      <div className="mt-2 text-blue-100">*/}
            {/*        /!*<p>GPA tổng kết: <span className="font-bold text-white">{currentProgram?.stats.overallGPA.toFixed(2)}</span></p>*!/*/}
            {/*        /!*<p>Tín chỉ: <span className="font-bold text-white">{currentProgram?.stats.creditsEarned}/{currentProgram?.stats.totalCredits}</span></p>*!/*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">*/}
            {/*      Đang học*/}
            {/*    </Badge>*/}
            {/*  </div>*/}
            {/*</Card>*/}
            <Select value={selectedEducation} onValueChange={(value) => {
              const edu = data?.data?.data?.educationPrograms?.find(e => e.code === value);
              if (edu) setSelectedEducation(edu?.code);
            }}>
              <SelectTrigger className={"w-full mb-5"} >
                <SelectValue placeholder="Chương trình đào tạo" />
              </SelectTrigger>
              <SelectContent>
                {!!data && data?.data?.data?.educationPrograms?.map((item, index) => (
                    <SelectItem value={item?.code} key={item?.code}>{item?.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsCard
                title="GPA Học kỳ"
                value={summary?.gpa?.toFixed(2) ?? '0.00'}
                subtitle="Học kỳ hiện tại"
                color="green"
            />
            <StatsCard
                title="Tín chỉ đạt"
                value={`${summary?.credits}`}
                subtitle={`/${summary?.credits ?? 0} tín chỉ`}
                color="purple"
            />
            <StatsCard
                title="Xếp loại"
                value={summary?.gpa !== undefined
                    ? summary.gpa >= 8.5
                        ? "Giỏi"
                        : summary.gpa >= 7.0
                            ? "Khá"
                            : summary.gpa >= 5.0
                                ? "Trung bình"
                                : "Yếu"
                    : "Chưa có"
                }
                subtitle="Học lực"
                color="pink"
            />
          </motion.div>
          <div className={"relative w-full "}>
            <Carousel
              className="w-3/5 inset-0 "
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent className="py-4 space-x-0">
                {!!semesters && semesters?.data?.data?.items?.filter(e => (+e.semesterCode?.split("_")[1]) >= (data?.data?.data?.informationBySchool?.yearOfHighSchoolGraduation ?? 0)).map((semester, index) => (
                  <CarouselItem onClick={() => { setSelectSemester(semester.semesterCode) }} key={semester.semesterCode} className="xl:basis-1/6 inset-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Badge
                        variant="outline"
                        className={`
                              cursor-pointer transition-all duration-300 transform hover:scale-105
                              px-3 py-1 text-sm font-medium
                               border-red-300 ${selectSemester === semester?.semesterCode && "bg-red-300"} hover:bg-red-200
                            `}
                      >{semester.semesterName}</Badge>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 bg-white" />
              <CarouselNext className="right-1 bg-white" />
            </Carousel>

          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Kết quả học tập - {studentSemester?.data?.data?.items[0]?.semesterCode}
                </h2>
                <Badge variant="outline" className="text-sm">
                  GPA: 0
                </Badge>
              </div>
              <div className="grid gap-4">
                {!!studentSemester && Object.entries<SubjectResult[]>(_.groupBy(studentSemester?.data?.data?.items[0]?.subjectResults, "subjectCode")).map(([key, grades], index) => (
                  <motion.div
                    key={`${key}-${key}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GradeCard grade={grades} semesterCode={studentSemester?.data?.data?.items[0]?.semesterCode} />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PredataScreen>
  )
}

export default EducationResult
