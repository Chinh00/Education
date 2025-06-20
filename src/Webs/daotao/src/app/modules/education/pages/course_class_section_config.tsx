﻿import {Box} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import {Card, Button, Tabs, Form} from "antd";
import PredataScreen from "@/app/components/screens/predata_screen";
import {useGetSubjects} from "@/app/modules/subject/hooks/hook.ts";
import {useGetDepartments} from "@/app/modules/common/hook.ts";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {ArrowRight} from "lucide-react"
import {FormInstance} from "antd/es/form/Form";
import {CreateSubjectScheduleConfigModel, SubjectScheduleConfigBothModel} from "@/app/modules/education/services/courseClass.service";

// Import từng form riêng biệt
import Form_create_course_class_section_config_stage1 from "@/app/modules/education/components/form_create_course_class_section_config_stage1";
import Form_create_course_class_section_config_stage2 from "@/app/modules/education/components/form_create_course_class_section_config_stage2";
import Form_create_course_class_section_config_both from "@/app/modules/education/components/form_create_course_class_section_config_both";

const Course_class_section_config = () => {
    const {subjectCode} = useParams();
    const [form1] = Form.useForm<CreateSubjectScheduleConfigModel & { totalPeriods: number }>();
    const [form2] = Form.useForm<CreateSubjectScheduleConfigModel & { totalPeriods: number }>();
    const [formBoth] = Form.useForm<SubjectScheduleConfigBothModel & { totalPeriods: number }>();

    const {data: subjects} = useGetSubjects({
        Filters: [{field: "subjectCode", operator: "==", value: subjectCode || ""}]
    })
    const subject = subjects?.data?.data?.items?.[0];

    const {data: departments} = useGetDepartments({
        Filters: [{field: "departmentCode", operator: "==", value: subject?.departmentCode || ""}]
    })
    const {currentParentSemester} = useAppSelector<CommonState>(e => e.common);
    const department = departments?.data?.data?.items?.[0];

    const extraTab = {
        key: "settings",
        children: <Button type={"dashed"} onClick={() => nav(`/course-class/${subjectCode}`)} variant={"filled"} color={"volcano"}>Danh sách lớp <ArrowRight size={18}/></Button>,
        label: <></>
    };
    const nav = useNavigate()

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
                        tabBarExtraContent={{
                            right: (
                                <Tabs
                                    size="small"
                                    activeKey="settings"
                                    items={[extraTab]}
                                    tabBarStyle={{ margin: 0 }}
                                />
                            ),
                        }}
                        items={[
                            {
                                label: "Cấu hình cho giai đoạn 1",
                                children: (
                                    <Form_create_course_class_section_config_stage1
                                        form={form1}
                                        subject={subject}
                                        semesterCode={currentParentSemester?.semesterCode}
                                    />
                                ),
                                key: "stage1"
                            },
                            {
                                label: "Cấu hình cho giai đoạn 2",
                                children: (
                                    <Form_create_course_class_section_config_stage2
                                        form={form2}
                                        subject={subject}
                                        semesterCode={currentParentSemester?.semesterCode}
                                    />
                                ),
                                key: "stage2"
                            },
                            {
                                label: "Cấu hình 2 giai đoạn",
                                children: (
                                    <Form_create_course_class_section_config_both
                                        formBoth={formBoth}
                                        subject={subject}
                                        semesterCode={currentParentSemester?.semesterCode}
                                    />
                                ),
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