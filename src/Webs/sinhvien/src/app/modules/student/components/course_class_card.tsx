import {CourseClassRegister} from "@/domain/course_class.ts";
import { Button } from "antd";

export type CourseClassCardProps = {
    courseClass: CourseClassRegister
}

const CourseClassCard = ({courseClass}: CourseClassCardProps) => {

    const getTypeText = (type: number) => {
        switch (type) {
            case 0: return 'Lý thuyết';
            case 1: return 'Thực hành';
            default: return type;
        }
    };

    const availableSlots = 1;
    
    return (
        <div className="border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                {/* Thông tin môn học */}
                <div className="flex-1 grid grid-cols-6 gap-4 text-sm">
                    {/*<div>*/}
                    {/*    <p className="font-medium text-gray-900">{courseClass.courseClassName}</p>*/}
                    {/*    <p className="text-xs text-gray-500">{getTypeText(courseClass.courseClassType)}</p>*/}
                    {/*</div>*/}

                    <div className="col-span-2">
                        <p className="text-gray-900">{courseClass.subjectName}</p>
                    </div>

                    <div>
                        <p className="text-gray-700">{courseClass.teacherName}</p>
                    </div>

                    <div>
                        <p className="text-gray-700">{"course.schedule"}</p>
                        <p className="text-xs text-gray-500">{"course.room"}</p>
                    </div>

                    <div>
                        <p className="text-gray-700">{courseClass.numberOfCredits} TC</p>
                        <p className="text-xs text-gray-500">{"course.enrolled}/{course.capacity"}</p>
                    </div>
                </div>

                {/* Nút thêm */}
                <div className="ml-4">
                    <Button
                        onClick={() => {}}
                        
                    >
                        Đăng ký
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default CourseClassCard