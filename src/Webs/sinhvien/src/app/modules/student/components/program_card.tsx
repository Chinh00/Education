import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import {StudentEducationProgram} from "@/domain/student_education_program.ts";
import {useNavigate} from "react-router";


interface ProgramCardProps {
    index: number;
    program: StudentEducationProgram;
}

const ProgramCard = ({ program, index }: ProgramCardProps) => {
    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Đang học' : 'Đã hoàn thành';
    };

    const getGPAColor = (gpa: number) => {
        if (gpa >= 3.6) return 'text-green-600';
        if (gpa >= 3.2) return 'text-blue-600';
        if (gpa >= 2.5) return 'text-yellow-600';
        return 'text-red-600';
    };
    const nav = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card
                className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50"
                onClick={() => {
                    nav(`/student/result/${program?.code}`)
                }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{program.name}</h3>
                            {/*<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">*/}
                            {/*    <div className="flex items-center gap-1">*/}
                            {/*        <BookOpen className="w-4 h-4" />*/}
                            {/*        <span>{program.stats.creditsEarned}/{program.stats.totalCredits} tín chỉ</span>*/}
                            {/*    </div>*/}
                            {/*    <span>•</span>*/}
                            {/*    <span>Xếp loại: {program.stats.classification}</span>*/}
                            {/*</div>*/}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">GPA:</span>
                {/*                <span className={`text-xl font-bold ${getGPAColor(program.stats.overallGPA)}`}>*/}
                {/*  /!*{program.stats.overallGPA.toFixed(2)}*!/*/}
                {/*</span>*/}
                            </div>
                        </div>
                    </div>
                    <Badge className={getStatusColor("active")}>
                        {getStatusText("active")}
                    </Badge>
                </div>
            </Card>
        </motion.div>
    );
};

export default ProgramCard;
