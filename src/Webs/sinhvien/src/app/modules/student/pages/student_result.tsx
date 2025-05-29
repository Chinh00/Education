import { Card, CardContent } from "@/app/components/ui/card";
import { Calendar, GraduationCap, User } from "lucide-react";
import useGetStudentInformation from "../hooks/useGetStudentInformation";
import {motion} from "framer-motion"
import {Button} from "@/app/components/ui/button.tsx";
import {
    ArrowLeft
} from "lucide-react"
import StatsCard from "../components/stats_card";
import {Badge} from "@/app/components/ui/badge";
import ProgramCard from "../components/program_card";
import {DateTimeFormat} from "@/infrastructure/datetime_format.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
const StudentResult = () => {
    const {data, isLoading, isSuccess} = useGetStudentInformation();
    return (
        <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-3xl"></div>
                            <div className="relative flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <User className="w-8 h-8" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold">{data?.data?.data?.personalInformation?.fullName}</h1>
                                        <div className="flex items-center gap-4 mt-2 text-blue-100">
                                            <div className="flex items-center gap-1">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{data?.data?.data?.informationBySchool?.studentCode}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{DateTimeFormat(data?.data?.data?.personalInformation?.birthDate ?? (new Date()).toString(), "DD-MM-YYYY")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-blue-100">Tổng số chương trình</div>
                                    <div className="text-xl font-semibold">{data?.data?.data?.educationPrograms?.length}</div>
                                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white hover:bg-white/30">
                                        {data?.data?.data?.educationPrograms?.length} đang học
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Programs List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6 text-gray-900">Chương trình học</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {!!data && data?.data?.data?.educationPrograms?.map((program, index) => (
                                    <ProgramCard
                                        key={program.code}
                                        program={program}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

        </PredataScreen>
    )
}

export default StudentResult