import {CourseClassRegister} from "@/domain/course_class.ts";
import { Button } from "antd";

export type CourseClassCardProps = {
    courseClass: CourseClassRegister & { children?: CourseClassRegister[] },
    onClick: (courseClassCode: string) => void
}

const getTypeText = (type: number) => {
    switch (type) {
        case 0: return 'Lý thuyết';
        case 1: return 'Thực hành';
        default: return type;
    }
};

const getStageText = (stage: number) => stage ? `Giai đoạn ${stage}` : "";

const getDayOfWeekText = (day: number) => {
    const days = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'];
    return days[day] || day;
};

const renderSlotTimes = (slotTimes?: any[]) => {
    if (!slotTimes || slotTimes.length === 0) return null;
    return slotTimes.map((slot, idx) => (
        <div key={idx} className="text-xs text-gray-500">
            <span>Phòng {slot.roomCode} - {getDayOfWeekText(slot.dayOfWeek)}: tiết {slot.slot.join(", ")}</span>
        </div>
    ));
};

const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
};

const CourseClassCard = ({courseClass, onClick}: CourseClassCardProps) => {
    return (
        <div className="border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors mb-4">
            {/* Lớp lý thuyết */}
            <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-6 gap-4 text-sm">
                    <div className="col-span-2">
                        <p className="font-medium text-gray-900">{courseClass.subjectName}</p>
                        <p className="text-xs text-blue-500">{getTypeText(courseClass.courseClassType)}</p>
                        <p className="text-xs text-gray-400">{courseClass.courseClassCode}</p>
                        <p className="text-xs text-purple-600">{getStageText(courseClass.stage)}</p>
                        <p className="text-xs text-gray-500">
                            Thời gian: {formatDate(courseClass.startDate)} - {formatDate(courseClass.endDate)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700">{courseClass.teacherName}</p>
                    </div>
                    <div>
                        {renderSlotTimes(courseClass.slotTimes)}
                    </div>
                    <div>
                        <p className="text-gray-700">{courseClass.numberOfCredits} TC</p>
                        <p className="text-xs text-gray-500">{(courseClass.students?.length ?? 0)}/{courseClass.numberStudentsExpected}</p>
                    </div>
                </div>
                <div className="ml-4">
                    <Button onClick={() => onClick(courseClass?.courseClassCode)}>Đăng ký</Button>
                </div>
            </div>

            {/* Các lớp thực hành (Lab) */}
            {courseClass.children && courseClass.children.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-blue-100">
                    <div className="mb-2 font-semibold text-blue-600 text-xs">Các lớp thực hành:</div>
                    {courseClass.children.map((lab) => (
                        <div key={lab.courseClassCode} className="flex items-center justify-between mb-2">
                            <div className="flex-1 grid grid-cols-6 gap-4 text-sm">
                                <div className="col-span-2">
                                    <p className="font-medium text-gray-900">{lab.courseClassName}</p>
                                    <p className="text-xs text-green-500">{getTypeText(lab.courseClassType)}</p>
                                    <p className="text-xs text-gray-400">{lab.courseClassCode}</p>
                                    <p className="text-xs text-purple-600">{getStageText(lab.stage)}</p>
                                    <p className="text-xs text-gray-500">
                                        Thời gian: {formatDate(lab.startDate)} - {formatDate(lab.endDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-700">{lab.teacherName}</p>
                                </div>
                                <div>
                                    {renderSlotTimes(lab.slotTimes)}
                                </div>
                                <div>
                                    <p className="text-gray-700">{lab.numberOfCredits} TC</p>
                                    <p className="text-xs text-gray-500">{(lab.students?.length ?? 0)}/{lab.numberStudentsExpected}</p>
                                </div>
                            </div>
                            <div className="ml-4">
                                <Button>Đăng ký</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseClassCard;