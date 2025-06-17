import {Box} from "@mui/material";
import {useParams} from "react-router";
import {useGenerateCourseClasses} from "@/app/modules/education/hooks/useGenerateCourseClasses";
import {Card, Form, Input, InputNumber, Button, Select, message, Tabs, Radio} from "antd";
import {
    CreateSubjectScheduleConfigModel,
    SubjectScheduleConfigBothModel
} from "@/app/modules/education/services/courseClass.service";
import PredataScreen from "@/app/components/screens/predata_screen";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {Badge} from "@/app/components/ui/badge";
import {useGetConditions, useGetDepartments} from "@/app/modules/common/hook.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {FormInstance, useWatch} from "antd/es/form/Form";
import Form_create_course_class_section_config
    from "@/app/modules/education/components/form_create_course_class_section_config.tsx";

const Course_class_section_config = () => {
    const {subjectCode} = useParams();
    const [form] = Form.useForm<CreateSubjectScheduleConfigModel & { totalPeriods: number }>();
    const [formBoth] = Form.useForm<SubjectScheduleConfigBothModel & { totalPeriods: number }>();
   
    
    const {data: subjects} = useGetSubjects({
        Filters: [
            {field: "subjectCode", operator: "==", value: subjectCode || ""}
        ]
    })
    const subject = subjects?.data?.data?.items?.[0];

    const {data: departments} = useGetDepartments({
        Filters: [
            {field: "departmentCode", operator: "==", value: subject?.departmentCode || ""}
        ]
    })
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common);
    const department = departments?.data?.data?.items?.[0];


    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <Card title={<div
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-white/80 rounded-lg px-4 py-2 shadow mb-3 border border-blue-100">
                    <span className="font-semibold text-gray-700">Môn học:</span>
                    <span className="text-blue-600 font-bold text-base">{subject?.subjectName || ""}</span>
                    <span className="text-gray-500 font-medium">| Mã: <span
                        className="font-mono">{subject?.subjectCode || ""}</span></span>
                    <span className="text-gray-500 font-medium">| Số tín chỉ: <span
                        className="font-mono">{subject?.numberOfCredits || ""}</span></span>
                    <span className="text-gray-500 font-medium">| Tổng số tiết học: <span
                        className="font-mono">{(subject?.numberOfCredits ?? 0) * 15 || ""}</span></span>
                    <span className="ml-auto flex items-center">
                        <span
                            className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs flex items-center shadow border border-blue-200">
                            Bộ môn: {department?.departmentName || ""}
                        </span>
                    </span>
                </div>}
                >
                    <Tabs
                        items={[
                            {
                                label: "Cấu hình cho giai đoạn 1",
                                children: <Form_create_course_class_section_config stage={0} form={form}
                                                                                   subject={subject } semesterCode={currentParentSemester?.semesterCode}
                                                                                   onSubmit={function (data: FormInstance): void {
                                                                                       throw new Error("Function not implemented.");
                                                                                   }}                                
                                />,
                                key: "stage1"
                            },
                            {
                                label: "Cấu hình cho giai đoạn 2",
                                children: <Form_create_course_class_section_config stage={1} form={form}
                                                                                   subject={subject } semesterCode={currentParentSemester?.semesterCode}
                                                                                   onSubmit={function (data: FormInstance): void {
                                                                                       throw new Error("Function not implemented.");
                                                                                   }}                                
                                />,
                                key: "stage2"
                            },
                            {
                                label: "Cấu hình 2 giai đoạn",
                                children: <Form_create_course_class_section_config
                                        formBoth={formBoth}
                                    stage={2} form={form}
                                                                                   subject={subject } semesterCode={currentParentSemester?.semesterCode}
                                                                                   onSubmit={function (data: FormInstance): void {
                                                                                       throw new Error("Function not implemented.");
                                                                                   }}                                
                                />,
                                key: "stageBoth"
                            },
                            
                            

                        ]}
                    >
                    </Tabs>
                </Card>
            </Box>
        </PredataScreen>
    );
};

export default Course_class_section_config;