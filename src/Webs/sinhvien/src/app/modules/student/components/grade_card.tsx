import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { BookOpen, Award, Star } from 'lucide-react';
import {SubjectResult} from "@/domain/subject_result.ts";


interface GradeCardProps {
    grade: SubjectResult;
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

    const getStatusText = (status: string) => {
        switch (status) {
            case 'excellent':
                return 'Xuất sắc';
            case 'pass':
                return 'Đạt';
            case 'fail':
                return 'Không đạt';
            default:
                return 'Chưa có';
        }
    };


    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-purple-50">
                        <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{grade.subjectName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span>Mã: {grade?.subjectCode}</span>
                            <span>•</span>
                            <span>{grade.numberOfCredits} tín chỉ</span>
                            <span>•</span>
                            <span>{semesterCode}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">{grade?.mark}</div>
                        <div className="text-lg text-gray-600">({grade?.mark})</div>
                    </div>
                    <Badge className={"bg-green-100 text-green-800"}>
                        Đạt
                    </Badge>
                </div>
            </div>
        </Card>
    );
};

export default GradeCard;