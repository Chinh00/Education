import { Card, CardContent } from "@/app/components/ui/card";
import { Calendar } from "lucide-react";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/app/components/ui/accordion";
import {HistorySemester} from "@/domain/history_semester.model.ts";
import dayjs from "dayjs";


const StudentResult = () => {
    const { data } = useGetStudentInformation();
    return (
        <Card className={"hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500"}>
            <CardContent>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Kết quả học tập theo học kỳ</h2>
                    {/*{!!data?.data?.data?.historySemesters && data?.data?.data?.historySemesters?.map((c: HistorySemester) => {*/}
                    {/*    return (*/}
                    {/*        <Accordion type="multiple" className="w-full space-y-4">*/}
                    {/*            <AccordionItem*/}
                    {/*                key={c?.semesterCode}*/}
                    {/*                value={c?.semesterCode}*/}
                    {/*                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"*/}
                    {/*            >*/}
                    {/*                <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-blue-50 to-indigo-50">*/}
                    {/*                    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full text-left">*/}
                    {/*                        <div className="flex items-center">*/}
                    {/*                            <div className="mr-4 bg-blue-100 p-2 rounded-full">*/}
                    {/*                                <Calendar className="h-5 w-5 text-blue-600" />*/}
                    {/*                            </div>*/}
                    {/*                            <div>*/}
                    {/*                                <h3 className="font-medium text-lg">{c?.semesterName}</h3>*/}
                    {/*                                <p className="text-sm text-muted-foreground">*/}
                    {/*                                    {dayjs(c?.startDate).format("DD-MM-YYYY")} - {c?.endDate}*/}
                    {/*                                </p>*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                        <div className="flex items-center gap-4 mt-2 md:mt-0">*/}
                    {/*                            <div className="text-center">*/}
                    {/*                                <p className="text-sm text-muted-foreground">GPA</p>*/}
                    {/*                                <p className="font-bold text-blue-600">*/}
                    {/*                                    /!*{ === "Đang học" ? "-" : semester.gpa.toFixed(2)}*!/*/}
                    {/*                                    Đang học*/}
                    {/*                                </p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className="text-center">*/}
                    {/*                                <p className="text-sm text-muted-foreground">Tín chỉ</p>*/}
                    {/*                                <p className="font-bold text-green-600">{10}</p>*/}
                    {/*                            </div>*/}
                    {/*                            /!*<Badge*!/*/}
                    {/*                            /!*    className={*!/*/}
                    {/*                            /!*        semester.status === "Đã hoàn thành"*!/*/}
                    {/*                            /!*            ? "bg-green-100 text-green-800"*!/*/}
                    {/*                            /!*            : "bg-blue-100 text-blue-800"*!/*/}
                    {/*                            /!*    }*!/*/}
                    {/*                            /!*>*!/*/}
                    {/*                            /!*    {semester.status}*!/*/}
                    {/*                            /!*</Badge>*!/*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </AccordionTrigger>*/}
                    {/*                <AccordionContent className="px-6 py-4">*/}
                    {/*                    <div className="overflow-x-auto">*/}
                    {/*                        <table className="w-full border-collapse">*/}
                    {/*                            <thead>*/}
                    {/*                            <tr className="bg-muted/50 text-left">*/}
                    {/*                                <th className="p-2 font-medium">Mã môn</th>*/}
                    {/*                                <th className="p-2 font-medium">Tên môn học</th>*/}
                    {/*                                <th className="p-2 font-medium text-center">Tín chỉ</th>*/}
                    {/*                                <th className="p-2 font-medium text-center">Điểm</th>*/}
                    {/*                                <th className="p-2 font-medium">Giảng viên</th>*/}
                    {/*                                <th className="p-2 font-medium text-center">Trạng thái</th>*/}
                    {/*                            </tr>*/}
                    {/*                            </thead>*/}
                    {/*                            <tbody>*/}
                    {/*                            {c?.subjectResults?.map((subject, index) => (*/}
                    {/*                                <tr*/}
                    {/*                                    key={subject?.subjectCode}*/}
                    {/*                                    className={`${index % 2 === 0 ? "bg-white" : "bg-muted/20"} hover:bg-muted/30 transition-colors`}*/}
                    {/*                                >*/}
                    {/*                                    <td className="p-2 font-medium">{subject?.subjectCode}</td>*/}
                    {/*                                    <td className="p-2">{subject?.subjectName}</td>*/}
                    {/*                                    <td className="p-2 text-center">{subject?.numberOfCredits}</td>*/}
                    {/*                                    <td className="p-2 text-center">*/}
                    {/*                                        /!*{course.grade ? (*!/*/}
                    {/*                                        /!*    <Badge className={getGradeColor(course.grade)}>{course.grade}</Badge>*!/*/}
                    {/*                                        /!*) : (*!/*/}
                    {/*                                        /!*    <span className="text-muted-foreground text-sm italic">Chưa có điểm</span>*!/*/}
                    {/*                                        /!*)}*!/*/}
                    {/*                                    </td>*/}
                    {/*                                    <td className="p-2">{subject?.description}</td>*/}
                    {/*                                    <td className="p-2 text-center">*/}
                    {/*                                        /!*<Badge*!/*/}
                    {/*                                        /!*    className={*!/*/}
                    {/*                                        /!*        course.status === "Đã hoàn thành"*!/*/}
                    {/*                                        /!*            ? "bg-green-100 text-green-800"*!/*/}
                    {/*                                        /!*            : "bg-blue-100 text-blue-800"*!/*/}
                    {/*                                        /!*    }*!/*/}
                    {/*                                        /!*>*!/*/}
                    {/*                                        /!*    {course.status}*!/*/}
                    {/*                                        /!*</Badge>*!/*/}
                    {/*                                    </td>*/}
                    {/*                                </tr>*/}
                    {/*                            ))}*/}
                    {/*                            </tbody>*/}
                    {/*                        </table>*/}
                    {/*                    </div>*/}


                    {/*                </AccordionContent>*/}
                    {/*            </AccordionItem>*/}
                    {/*        </Accordion>*/}
                    {/*    )*/}
                    {/*})}*/}
                </div>
            </CardContent>
        </Card>
    )
}

export default StudentResult