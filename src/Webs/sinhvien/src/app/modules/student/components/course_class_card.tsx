import { CourseClassRegister } from "@/domain/course_class.ts";
import { Button } from "antd";
import RegisterNewPreview from "@/app/modules/student/components/register_new_preview.tsx";
import { ReactElement } from "react";

export type CourseClassCardProps = {
    courseClass: CourseClassRegister & { children?: CourseClassRegister[] },
    onClick: (courseClassCode: string) => void,
    loading?: boolean,
    trungLich?: boolean,
    courseClassRegister: string[],
    courseClassCodeTrungLich?: string
};


const getDayOfWeekText = (day: number) => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    return days[day] || day;
};

const renderSlotTimesTable = (slotTimes?: any[]) => {
    if (!slotTimes || slotTimes.length === 0) return null;
    return slotTimes.map((slot, idx) => (
        <tr key={idx}>
            <td className="py-1 px-2 border border-gray-200 text-center text-xs">{slot.weeks || ""}</td>
            <td className="py-1 px-2 border border-gray-200 text-center text-xs">{slot.weekRange || ""}</td>
            <td className="py-1 px-2 border border-gray-200 text-center text-xs">{getDayOfWeekText(slot.dayOfWeek)} : Tiết {slot.slot.join(" ➞ Tiết ")}</td>
            <td className="py-1 px-2 border border-gray-200 text-center text-xs">{slot.roomCode}</td>
            <td className="py-1 px-2 border border-gray-200 text-center text-xs">{slot.teacherName}</td>
        </tr>
    ));
};

const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("vi-VN");
};

const CourseClassCard = ({
                             courseClass,
                             onClick,
                             loading,
                             courseClassRegister, trungLich,
                             courseClassCodeTrungLich
                         }: CourseClassCardProps) => {
    const totalStudents = courseClass.students?.length ?? 0;
    const maxStudents = courseClass.numberStudentsExpected;

    return (
        <div className="bg-white rounded-lg border mb-6 overflow-hidden shadow">
            <div className={`flex items-center px-2 py-2 ${!trungLich ? "bg-gray-500" : "bg-red-500"}  text-white font-semibold text-base justify-between`}>
                <div className="flex items-center gap-2 flex-col">
                    <span className={`${totalStudents >= maxStudents ? "text-red-400" : "text-gray-300"} text-sm mr-2`}>
                        {totalStudents >= maxStudents ? "(Lớp đã đầy)" : ""}
                    </span>
                    <span>Lớp chính: <span className="font-bold ml-1">{courseClass.subjectName} ({courseClass.courseClassCode})</span></span>
                    <span className={"font-bold text-sm"}>{trungLich && !courseClassRegister?.includes(courseClass?.courseClassCode) ? `Trùng lịch với lớp: ${courseClassCodeTrungLich}` : ""}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-normal text-sm">{totalStudents}/{maxStudents}</span>
                    <Button
                        loading={loading}
                        onClick={() => onClick(courseClass?.courseClassCode)}
                        // disabled={trungLich}
                        type={courseClassRegister?.includes(courseClass?.courseClassCode) ? "default" : "primary"}
                        style={{color: "white", backgroundColor: courseClassRegister?.includes(courseClass?.courseClassCode) ? "red" : "#1677ff"}}
                        className={`rounded px-4 py-1 ml-2  text-white` }
                    >
                        {courseClassRegister?.includes(courseClass?.courseClassCode) ? "Hủy đăng ký" : "Đăng ký"}
                    </Button>
                </div>
            </div>

            <table className="w-full bg-white text-xs">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-2 border border-gray-200">Tuần</th>
                    <th className="py-2 px-2 border border-gray-200">Thời gian</th>
                    <th className="py-2 px-2 border border-gray-200">Thời gian</th>
                    <th className="py-2 px-2 border border-gray-200">Phòng</th>
                    <th className="py-2 px-2 border border-gray-200">Giáo viên</th>
                </tr>
                </thead>
                <tbody>
                {renderSlotTimesTable(courseClass.slotTimes?.map(slot => ({
                    weeks: `${slot.weekStart} -> ${slot.weekEnd}` || "36→41",
                    weekRange: `(${formatDate(courseClass.startDate)} ➡ ${formatDate(courseClass.endDate)})`,
                    dayOfWeek: slot.dayOfWeek,
                    slot: slot.slot?.map(e => +e + 1),
                    roomCode: slot.roomCode,
                    teacherName: courseClass.teacherName,
                })))}
                </tbody>
            </table>
            {courseClass.children && courseClass.children.length > 0 && (
                <div className="bg-gray-50 px-4 pb-4">
                    <div className="italic text-sm pt-3 pb-2 text-gray-700 font-medium">Các lớp thành phần:</div>
                    {courseClass.children.map((lab, idx) => {
                        const labStudents = lab.students?.length ?? 0;
                        return (
                            <div
                                key={lab.courseClassCode}
                                className={`flex flex-col md:flex-row md:items-center md:justify-between mb-2 rounded bg-gray-100 border ${labStudents >= lab.numberStudentsExpected ? "opacity-80" : ""}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center w-full">
                                    {/* Trạng thái lớp */}
                                    <div className="flex items-center px-3 py-2">
                                        <span className={`px-3 py-1 rounded text-xs font-semibold ${labStudents >= lab.numberStudentsExpected ? "bg-pink-200 text-pink-700" : "bg-gray-300 text-gray-600"}`}>
                                            {labStudents >= lab.numberStudentsExpected ? "LỚP ĐÃ ĐẦY" : ""}
                                        </span>
                                    </div>
                                    {/* Tên lớp và mã */}
                                    <div className="flex-1 text-sm font-semibold">
                                        {lab.subjectName || ""} ({lab.courseClassCode})
                                    </div>
                                    {/* Thời gian, phòng, giáo viên */}
                                    <table className="w-auto mx-3 my-2 border border-gray-200 rounded">
                                        <tbody>
                                        {renderSlotTimesTable(lab.slotTimes?.map(slot => ({
                                            weeks: `${slot.weekStart} -> ${slot.weekEnd}` || "36→41",
                                            weekRange: `(${formatDate(lab.startDate)} ➡ ${formatDate(lab.endDate)})`,
                                            dayOfWeek: slot.dayOfWeek,
                                            slot: slot.slot?.map(e => +e + 1),
                                            roomCode: slot.roomCode,
                                            teacherName: lab.teacherName,
                                        })))}
                                        </tbody>
                                    </table>
                                    {/* Sĩ số và nút đăng ký lớp thành phần */}
                                    <div className="flex items-center px-3 py-2 text-sm font-normal text-gray-500 gap-2">
                                        <span>{labStudents}/{lab.numberStudentsExpected}</span>
                                        <Button
                                            disabled={courseClassRegister?.includes(lab?.courseClassCode)}
                                            onClick={() => onClick(lab?.courseClassCode)}
                                            className={`rounded px-3 py-1 ml-2 ${courseClassRegister?.includes(lab?.courseClassCode) ? "bg-gray-300" : "bg-cyan-500 text-white"}`}
                                        >
                                            Đăng ký
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseClassCard;