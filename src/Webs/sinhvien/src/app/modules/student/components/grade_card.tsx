import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { BookOpen, Award, Star } from 'lucide-react';
import { SubjectResult } from "@/domain/subject_result.ts";

interface GradeCardProps {
    grade: SubjectResult[];
    semesterCode: string
}

const GradeCard = ({ grade, semesterCode }: GradeCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent':
                return 'bg-green-100 text-green-800';
            case 'pass':
                return 'bg-blue-100 text-blue-800';
            case 'fail':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (finalGrade: number) => {
        if (finalGrade >= 8.5) return 'Xuất sắc';
        if (finalGrade >= 7.0) return 'Khá';
        if (finalGrade >= 5.5) return 'Trung bình';
        if (finalGrade >= 4.0) return 'Đạt';
        return 'Không đạt';
    };

    const getStatusColorByGrade = (finalGrade: number) => {
        if (finalGrade >= 8.5) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (finalGrade >= 7.0) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (finalGrade >= 5.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (finalGrade >= 4.0) return 'bg-green-100 text-green-800 border-green-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    // Calculate final grade based on process score and exam score with their coefficients
    const processScore = grade?.filter(c => c.subjectMarkType === 0)[0];
    const examScore = grade?.filter(c => c.subjectMarkType === 2)[0];

    const calculateFinalGrade = () => {
        if (!processScore?.mark || !examScore?.mark) return 0;

        const totalCoefficient = (processScore.coeffiecient || 0) + (examScore.coeffiecient || 0);
        if (totalCoefficient === 0) return 0;

        const finalGrade = (
            (processScore.mark * (processScore.coeffiecient ?? 0)) +
            (examScore.mark * (examScore.coeffiecient ?? 0))
        ) / totalCoefficient;

        return Math.round(finalGrade * 10) / 10; // Round to 1 decimal place
    };

    const finalGrade = calculateFinalGrade();

    return (
        <Card className="p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-indigo-100">
                            <BookOpen className="w-4 h-4 text-indigo-700" />
                        </div>
                        <h3 className="font-semibold text-base text-gray-900 truncate max-w-[180px]">{grade[0]?.subjectName}</h3>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1 text-xs">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">{grade[0]?.subjectCode}</span>
                        <span className="bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-700">{grade[0]?.numberOfCredits} TC</span>
                        <span className="bg-purple-50 px-1.5 py-0.5 rounded text-purple-700">{semesterCode}</span>
                    </div>
                </div>

                <div className="text-right space-y-2 ml-2">
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex items-center text-xs text-gray-600">
                            <span>QT:</span>
                            <span className="ml-1 font-medium text-sm text-gray-900">{processScore?.mark || 0}</span>
                            <span className="ml-0.5 text-xs text-gray-500">(×{processScore?.coeffiecient || 0})</span>
                        </div>

                        <div className="flex items-center text-xs text-gray-600">
                            <span>Thi:</span>
                            <span className="ml-1 font-medium text-sm text-gray-900">{examScore?.mark || 0}</span>
                            <span className="ml-0.5 text-xs text-gray-500">(×{examScore?.coeffiecient || 0})</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
                        <div className="font-bold text-base">{finalGrade.toFixed(1)}</div>
                        <Badge className={`${getStatusColorByGrade(finalGrade)} border text-xs px-1.5`}>
                            {getStatusText(finalGrade)}
                        </Badge>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default GradeCard;