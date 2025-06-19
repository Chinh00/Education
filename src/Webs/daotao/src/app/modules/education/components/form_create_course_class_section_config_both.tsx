import {Alert, Button, Form, Input, InputNumber, Select} from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import { useWatch } from "antd/es/form/Form";
import { useGetConditions } from "@/app/modules/common/hook.ts";
import {
    CreateSubjectScheduleConfigModel, SubjectScheduleConfigBothModel,
} from "@/app/modules/education/services/courseClass.service.ts";
import { Subject } from "@/domain/subject.ts";
import useCreateSubjectScheduleConfig from "@/app/modules/education/hooks/useCreateSubjectScheduleConfig.ts";
import toast from "react-hot-toast";
import { useGetSubjectScheduleConfig } from "@/app/modules/education/hooks/useGetSubjectScheduleConfig.ts";
import {WarningOutlined} from "@ant-design/icons";

export type Props = {
    formBoth: FormInstance,
    subject?: Subject,
    semesterCode?: string,
};

const Form_create_course_class_section_config_both = ({
                                                          formBoth,
                                                          subject,
                                                          semesterCode,
                                                      }: Props) => {
    const { data: conditions } = useGetConditions({});

    // Tổng số tiết
    const totalPeriods = useWatch("totalPeriods", formBoth) ?? 0;
    const totalPeriodOfStage1 = useWatch(['totalPeriodOfStage1'], formBoth) ?? 21;
    const totalPeriodOfStage2 = useWatch(['totalPeriodOfStage2'], formBoth) ?? totalPeriods - 21;

    // Lý thuyết/thực hành GD1
    const theoryTotalPeriodOfStage1 = useWatch(['theoryTotalPeriodOfStage1'], formBoth) ?? 0;
    const practiceTotalPeriodOfStage1 = useWatch(['practiceTotalPeriodOfStage1'], formBoth) ?? 0;
    // Lý thuyết/thực hành GD2
    const theoryTotalPeriodOfStage2 = useWatch(['theoryTotalPeriodOfStage2'], formBoth) ?? 0;
    const practiceTotalPeriodOfStage2 = useWatch(['practiceTotalPeriodOfStage2'], formBoth) ?? 0;

    // Tự động cập nhật tổng số tiết của từng giai đoạn khi tổng số tiết hoặc giai đoạn thay đổi
    useEffect(() => {
        const val1 = Number(totalPeriodOfStage1) || 0;
        if (val1 > totalPeriods) {
            formBoth?.setFieldsValue({
                ...formBoth.getFieldsValue(),
                totalPeriodOfStage1: totalPeriods,
                totalPeriodOfStage2: 0
            });
        } else {
            formBoth?.setFieldsValue({
                ...formBoth.getFieldsValue(),
                totalPeriodOfStage2: totalPeriods - val1
            });
        }
    }, [totalPeriods, totalPeriodOfStage1]);

    // Tự động cập nhật thực hành khi thay đổi lý thuyết (và ngược lại) trong từng giai đoạn
    const handleTheoryOfStage1Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["totalPeriodOfStage1"]) || 0;
        const theory = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            ...formBoth.getFieldsValue(),
            theoryTotalPeriodOfStage1: theory,
            practiceTotalPeriodOfStage1: total - theory
        });
    };
    const handlePracticeOfStage1Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["totalPeriodOfStage1"]) || 0;
        const practice = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            ...formBoth.getFieldsValue(),
            practiceTotalPeriodOfStage1: practice,
            theoryTotalPeriodOfStage1: total - practice
        });
    };
    const handleTheoryOfStage2Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["totalPeriodOfStage2"]) || 0;
        const theory = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            ...formBoth.getFieldsValue(),
            theoryTotalPeriodOfStage2: theory,
            practiceTotalPeriodOfStage2: total - theory
        });
    };
    const handlePracticeOfStage2Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["totalPeriodOfStage2"]) || 0;
        const practice = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            ...formBoth.getFieldsValue(),
            practiceTotalPeriodOfStage2: practice,
            theoryTotalPeriodOfStage2: total - practice
        });
    };

    // --- Load lại dữ liệu từ API
    const { mutate } = useCreateSubjectScheduleConfig();
    const { data: subjectScheduleConfigs } = useGetSubjectScheduleConfig({
        Filters: [
            { field: "SemesterCode", operator: "==", value: semesterCode || "" },
            { field: "SubjectCode", operator: "==", value: subject?.subjectCode || "" },
            { field: "Stage", operator: "In", value: "2,3" }
        ]
    }, subject?.subjectCode !== undefined);

    useEffect(() => {
        if (subject) {
            formBoth.setFieldsValue({
                ...formBoth.getFieldsValue(),
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                totalPeriodOfStage1: 21,
                totalPeriodOfStage2: (subject.numberOfCredits ?? 0) * 15 - 21,
            });
        }
    }, [subject]);

    useEffect(() => {
        if (subjectScheduleConfigs && subjectScheduleConfigs?.data?.data?.items?.length > 0) {
            const stage1Config = subjectScheduleConfigs?.data?.data?.items?.find(e => e.stage === 2);
            const stage2Config = subjectScheduleConfigs?.data?.data?.items?.find(e => e.stage === 3);
            if (stage1Config) {
                formBoth.setFieldsValue({
                    ...formBoth.getFieldsValue(),
                    totalPeriodOfStage1: (stage1Config.theoryTotalPeriod ?? 0) + (stage1Config.practiceTotalPeriod ?? 0),
                    theoryTotalPeriodOfStage1: stage1Config.theoryTotalPeriod ?? 0,
                    practiceTotalPeriodOfStage1: stage1Config.practiceTotalPeriod ?? 0,
                    theorySessionsOfStage1: stage1Config.theorySessions ?? [],
                    practiceSessionsOfStage1: stage1Config.practiceSessions ?? [],
                    theoryWeekStartStage1: stage1Config.weekLectureStart ?? 1,
                    theoryWeekEndStage1: stage1Config.weekLectureEnd ?? 8,
                    practiceWeekStartStage1: stage1Config.weekLabStart ?? 3,
                    practiceWeekEndStage1: stage1Config.weekLabEnd ?? 8,
                    sessionPriorityOfStage1: stage1Config.sessionPriority,
                    lectureRequiredConditions: stage1Config.lectureRequiredConditions || [],
                    labRequiredConditions: stage1Config.labRequiredConditions || [],
                });
            }
            if (stage2Config) {
                formBoth.setFieldsValue({
                    ...formBoth.getFieldsValue(),
                    totalPeriodOfStage2: (stage2Config.theoryTotalPeriod ?? 0) + (stage2Config.practiceTotalPeriod ?? 0),
                    theoryTotalPeriodOfStage2: stage2Config.theoryTotalPeriod ?? 0,
                    practiceTotalPeriodOfStage2: stage2Config.practiceTotalPeriod ?? 0,
                    theorySessionsOfStage2: stage2Config.theorySessions ?? [],
                    practiceSessionsOfStage2: stage2Config.practiceSessions ?? [],
                    theoryWeekStartStage2: stage2Config.weekLectureStart ?? 1,
                    theoryWeekEndStage2: stage2Config.weekLectureEnd ?? 8,
                    practiceWeekStartStage2: stage2Config.weekLabStart ?? 3,
                    practiceWeekEndStage2: stage2Config.weekLabEnd ?? 8,
                    sessionPriorityOfStage2: stage2Config.sessionPriority,
                });
            }
        }
    }, [subjectScheduleConfigs]);
    console.log(formBoth.getFieldValue("theorySessionsOfStage2"))

    const handleTotalPeriodOfStage1Change = (value: number | null) => {
        const total = totalPeriods;
        const val1 = Math.max(0, Math.min(value ?? 0, total)); // không vượt tổng
        const val2 = total - val1;
        // Co lại lý thuyết/thực hành nếu vượt tổng mới
        let theory = Math.min(formBoth.getFieldValue("theoryTotalPeriodOfStage1") || 0, val1);
        let practice = val1 - theory;
        formBoth.setFieldsValue({
            totalPeriodOfStage1: val1,
            totalPeriodOfStage2: val2,
            theoryTotalPeriodOfStage1: theory,
            practiceTotalPeriodOfStage1: practice
        });
    };

    const handleTotalPeriodOfStage2Change = (value: number | null) => {
        const total = totalPeriods;
        const val2 = Math.max(0, Math.min(value ?? 0, total));
        const val1 = total - val2;
        // Co lại lý thuyết/thực hành nếu vượt tổng mới
        let theory = Math.min(formBoth.getFieldValue("theoryTotalPeriodOfStage2") || 0, val2);
        let practice = val2 - theory;
        formBoth.setFieldsValue({
            totalPeriodOfStage2: val2,
            totalPeriodOfStage1: val1,
            theoryTotalPeriodOfStage2: theory,
            practiceTotalPeriodOfStage2: practice
        });
    };
    const theoryWeekStartStage1 = useWatch(['theoryWeekStartStage1'], formBoth) ?? 1;
    const theoryWeekEndStage1 = useWatch(['theoryWeekEndStage1'], formBoth) ?? 1;
    const theoryNumWeeksStage1 = Math.max(1, Number(theoryWeekEndStage1) - Number(theoryWeekStartStage1) + 1);
    const avgTheoryPeriodsPerWeekStage1 = theoryTotalPeriodOfStage1 && theoryNumWeeksStage1 > 0
        ? +(theoryTotalPeriodOfStage1 / theoryNumWeeksStage1).toFixed(2)
        : 0;

// GD1 THỰC HÀNH
    const practiceWeekStartStage1 = useWatch(['practiceWeekStartStage1'], formBoth) ?? 1;
    const practiceWeekEndStage1 = useWatch(['practiceWeekEndStage1'], formBoth) ?? 1;
    const practiceNumWeeksStage1 = Math.max(1, Number(practiceWeekEndStage1) - Number(practiceWeekStartStage1) + 1);
    const avgPracticePeriodsPerWeekStage1 = practiceTotalPeriodOfStage1 && practiceNumWeeksStage1 > 0
        ? +(practiceTotalPeriodOfStage1 / practiceNumWeeksStage1).toFixed(2)
        : 0;

// GD2 LÝ THUYẾT
    const theoryWeekStartStage2 = useWatch(['theoryWeekStartStage2'], formBoth) ?? 1;
    const theoryWeekEndStage2 = useWatch(['theoryWeekEndStage2'], formBoth) ?? 1;
    const theoryNumWeeksStage2 = Math.max(1, Number(theoryWeekEndStage2) - Number(theoryWeekStartStage2) + 1);
    const avgTheoryPeriodsPerWeekStage2 = theoryTotalPeriodOfStage2 && theoryNumWeeksStage2 > 0
        ? +(theoryTotalPeriodOfStage2 / theoryNumWeeksStage2).toFixed(2)
        : 0;

    const practiceWeekStartStage2 = useWatch(['practiceWeekStartStage2'], formBoth) ?? 1;
    const practiceWeekEndStage2 = useWatch(['practiceWeekEndStage2'], formBoth) ?? 1;
    const practiceNumWeeksStage2 = Math.max(1, Number(practiceWeekEndStage2) - Number(practiceWeekStartStage2) + 1);
    const avgPracticePeriodsPerWeekStage2 = practiceTotalPeriodOfStage2 && practiceNumWeeksStage2 > 0
        ? +(practiceTotalPeriodOfStage2 / practiceNumWeeksStage2).toFixed(2)
        : 0;

    useEffect(() => {
        const session = Math.ceil(avgTheoryPeriodsPerWeekStage1 / 2);
        formBoth.setFieldsValue({
            theorySessionsOfStage1: [Math.ceil(avgTheoryPeriodsPerWeekStage1)]
        });
    }, [avgTheoryPeriodsPerWeekStage1, theoryTotalPeriodOfStage1]);

    useEffect(() => {
        formBoth.setFieldsValue({
            practiceSessionsOfStage1: [Math.ceil(avgPracticePeriodsPerWeekStage1)]
        });
    }, [avgPracticePeriodsPerWeekStage1]);

    useEffect(() => {
        const session = Math.ceil(avgTheoryPeriodsPerWeekStage2 / 2);
        formBoth.setFieldsValue({
            theorySessionsOfStage2: [Math.ceil(avgTheoryPeriodsPerWeekStage2)]
        });
    }, [avgTheoryPeriodsPerWeekStage2, theoryTotalPeriodOfStage2]);

    useEffect(() => {
        formBoth.setFieldsValue({
            practiceSessionsOfStage2: [Math.ceil(avgPracticePeriodsPerWeekStage2)]
        });
    }, [avgPracticePeriodsPerWeekStage2]);

    return (
        <Form<SubjectScheduleConfigBothModel & { totalPeriods: number }>
            form={formBoth}
            key="stageBoth"
            layout="vertical"
            initialValues={{
                semesterCode: semesterCode,
                subjectCode: subject?.subjectCode || "",
                totalPeriodOfStage1: 21,
                totalPeriodOfStage2: 24,
                theoryTotalPeriodOfStage1: 21,
                theoryTotalPeriodOfStage2: 24,
                practiceTotalPeriodOfStage1: 0,
                practiceTotalPeriodOfStage2: 0,
                theoryWeekStartStage1: 1,
                theoryWeekEndStage1: 8,
                practiceWeekStartStage1: 3,
                practiceWeekEndStage1: 8,
                theoryWeekStartStage2: 1,
                theoryWeekEndStage2: 8,
                practiceWeekStartStage2: 3,
                practiceWeekEndStage2: 8,
                theorySessionsOfStage1: [],
                practiceSessionsOfStage1: [],
                theorySessionsOfStage2: [],
                practiceSessionsOfStage2: [],
                sessionPriorityOfStage1: -1,
                sessionPriorityOfStage2: -1,
                lectureRequiredConditions: ["Lecture"],
                labRequiredConditions: [],
                totalPeriods: 0,
            }}
            onFinish={(values) => {
                const modelOfStage1: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        subjectCode: subject?.subjectCode || "",
                        stage: 2,
                        theoryTotalPeriod: values?.theoryTotalPeriodOfStage1 ?? 0,
                        practiceTotalPeriod: values?.practiceTotalPeriodOfStage1 ?? 0,
                        theorySessions: Array.isArray(values?.theorySessionsOfStage1)
                            ? values?.theorySessionsOfStage1
                            //@ts-ignore
                            : (typeof values?.theorySessionsOfStage1 === "string" && values?.theorySessionsOfStage1?.length > 0
                                //@ts-ignore
                                ? values?.theorySessionsOfStage1?.split(",").map(s => Number(s.trim()))
                                : []),
                        practiceSessions: Array.isArray(values?.practiceSessionsOfStage1)
                            ? values?.practiceSessionsOfStage1
                            //@ts-ignore
                            : (typeof values?.practiceSessionsOfStage1 === "string" && values?.practiceSessionsOfStage1?.length > 0
                                //@ts-ignore
                                ? values?.practiceSessionsOfStage1?.split(",").map(s => Number(s.trim()))
                                : []),
                        weekLectureStart: values?.theoryWeekStartStage1 ?? 1,
                        weekLectureEnd: values?.theoryWeekEndStage1 ?? 8,
                        weekLabStart: values?.practiceWeekStartStage1 ?? 1,
                        weekLabEnd: values?.practiceWeekEndStage1 ?? 8,
                        sessionPriority: values?.sessionPriorityOfStage1 ?? -1,
                        lectureRequiredConditions: values?.lectureRequiredConditions || [],
                        labRequiredConditions: values?.labRequiredConditions || [],
                    }
                };
                const modelOfStage2: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        subjectCode: subject?.subjectCode || "",
                        stage: 3,
                        theoryTotalPeriod: values?.theoryTotalPeriodOfStage2 ?? 0,
                        practiceTotalPeriod: values?.practiceTotalPeriodOfStage2 ?? 0,
                        theorySessions:  Array.isArray(values?.theorySessionsOfStage2)
                            ? values?.theorySessionsOfStage2
                            //@ts-ignore
                            : (typeof values?.theorySessionsOfStage2 === "string" && values?.theorySessionsOfStage2?.length > 0
                                //@ts-ignore
                                ? values?.theorySessionsOfStage2?.split(",").map(s => Number(s.trim()))
                                : []),
                        practiceSessions: Array.isArray(values?.practiceSessionsOfStage2)
                            ? values?.practiceSessionsOfStage2
                            //@ts-ignore
                            : (typeof values?.practiceSessionsOfStage2 === "string" && values?.practiceSessionsOfStage2?.length > 0
                                //@ts-ignore
                                ? values?.practiceSessionsOfStage2?.split(",").map(s => Number(s.trim()))
                                : []),
                        weekLectureStart: values?.theoryWeekStartStage2 ?? 1,
                        weekLectureEnd: values?.theoryWeekEndStage2 ?? 8,
                        weekLabStart: values?.practiceWeekStartStage2 ?? 1,
                        weekLabEnd: values?.practiceWeekEndStage2 ?? 8,
                        sessionPriority: values?.sessionPriorityOfStage2 ?? -1,
                        lectureRequiredConditions: values?.lectureRequiredConditions || [],
                        labRequiredConditions: values?.labRequiredConditions || [],
                    }
                };
                mutate(modelOfStage1, {
                    onSuccess: () => {
                        toast.success("Lưu cấu hình thành công (Giai đoạn 1)");
                    },
                    onError: () => {
                        toast.error("Lưu cấu hình thất bại Giai đoạn 1, Có lỗi xảy ra");
                    }
                });
                mutate(modelOfStage2, {
                    onSuccess: () => {
                        toast.success("Lưu cấu hình thành công (Giai đoạn 2)");
                    },
                    onError: () => {
                        toast.error("Lưu cấu hình thất bại Giai đoạn 2, Có lỗi xảy ra");
                    }
                });
            }}
            className={"grid grid-cols-4 gap-4"}
        >
            <div className={"col-span-4 flex flex-row justify-between items-center"}>
                <Form.Item className={""} name={"totalPeriods"} label="Tổng số tiết học" >
                    <InputNumber min={0} />
                </Form.Item>
                {(subjectScheduleConfigs?. data?.data?.totalItems ?? 0) < 2 && <Alert type={"warning"} icon={<WarningOutlined/>} className={"w-max h-min "}
                                                               message={"Chưa cấu hình đủ"}/>}
            </div>
            {/* Giai đoạn 1 */}
            <div className="w-full col-span-2 border rounded-md p-4 bg-gray-50">
                <div className="font-semibold mb-3">Giai đoạn 1</div>
                <Form.Item name={["totalPeriodOfStage1"]} label="Tổng số tiết GD1">
                    <InputNumber
                        min={0}
                        max={totalPeriods}
                        value={totalPeriodOfStage1}
                        onChange={handleTotalPeriodOfStage1Change}
                    />
                </Form.Item>
                
                
                <div className={"flex flex-row"}>
                    <Form.Item name={["theoryTotalPeriodOfStage1"]} label="Số tiết lý thuyết GD1">
                        <InputNumber min={0} max={totalPeriodOfStage1} onChange={handleTheoryOfStage1Change} />
                    </Form.Item>
                    <Form.Item name={["theoryWeekStartStage1"]} label="Tuần bắt đầu lý thuyết GD1">
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name={["theoryWeekEndStage1"]} label="Tuần kết thúc lý thuyết GD1">
                        <InputNumber min={1} />
                    </Form.Item>
                </div>
                <Form.Item label="Quy định lịch học lý thuyết GD1" name={["theorySessionsOfStage1"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldsValue(),
                                    theorySessionsOfStage1: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                
                
                <div className={"flex flex-row"}>
                    <Form.Item name={["practiceTotalPeriodOfStage1"]} label="Số tiết thực hành GD1">
                        <InputNumber min={0} max={totalPeriodOfStage1} onChange={handlePracticeOfStage1Change} />
                    </Form.Item>
                    <Form.Item name={["practiceWeekStartStage1"]} label="Tuần bắt đầu thực hành GD1">
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name={["practiceWeekEndStage1"]} label="Tuần kết thúc thực hành GD1">
                        <InputNumber min={1} />
                    </Form.Item>
                </div>
                <Form.Item label="Quy định lịch học thực hành GD1" name={["practiceSessionsOfStage1"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldsValue(),
                                    practiceSessionsOfStage1: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["sessionPriorityOfStage1"]} label="Ưu tiên buổi học GD1">
                    <Select
                        options={[
                            { value: 0, label: "Sáng" },
                            { value: 1, label: "Chiều" },
                            { value: -1, label: "Không ưu tiên" }
                        ]}
                    />
                </Form.Item>
            </div>
            {/* Giai đoạn 2 */}
            <div className="w-full col-span-2 border rounded-md p-4 bg-gray-50">
                <div className="font-semibold mb-3">Giai đoạn 2</div>
                <Form.Item name={["totalPeriodOfStage2"]} label="Tổng số tiết GD2">
                    <InputNumber
                        min={0}
                        max={totalPeriods}
                        value={totalPeriodOfStage2}
                        onChange={handleTotalPeriodOfStage2Change}
                    />
                </Form.Item>
            
                <div className={"flex flex-row"}>
                    <Form.Item name={["theoryTotalPeriodOfStage2"]} label="Số tiết lý thuyết GD2">
                        <InputNumber min={0} max={totalPeriodOfStage2} onChange={handleTheoryOfStage2Change} />
                    </Form.Item>
                    <Form.Item name={["theoryWeekStartStage2"]} label="Tuần bắt đầu lý thuyết GD2">
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name={["theoryWeekEndStage2"]} label="Tuần kết thúc lý thuyết GD2">
                        <InputNumber min={1} />
                    </Form.Item>
                </div>
                <Form.Item label="Quy định lịch học lý thuyết GD2" name={["theorySessionsOfStage2"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldsValue(),
                                    theorySessionsOfStage2: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
            
                <div className={"flex flex-row"}>
                    <Form.Item name={["practiceTotalPeriodOfStage2"]} label="Số tiết thực hành GD2">
                        <InputNumber min={0} max={totalPeriodOfStage2} onChange={handlePracticeOfStage2Change} />
                    </Form.Item>
                    <Form.Item name={["practiceWeekStartStage2"]} label="Tuần bắt đầu thực hành GD2">
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name={["practiceWeekEndStage2"]} label="Tuần kết thúc thực hành GD2">
                        <InputNumber min={1} max={8} />
                    </Form.Item>
                </div>
                <Form.Item label="Quy định lịch học thực hành GD2" name={["practiceSessionsOfStage2"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldsValue(),
                                    practiceSessionsOfStage2: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["sessionPriorityOfStage2"]} label="Ưu tiên buổi học GD2">
                    <Select
                        options={[
                            { value: 0, label: "Sáng" },
                            { value: 1, label: "Chiều" },
                            { value: -1, label: "Không ưu tiên" }
                        ]}
                    />
                </Form.Item>
            </div>
            <div className={"col-span-4"}>
                <Form.Item name={["lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                    <Select options={conditions?.data?.data?.items?.map(e => ({ label: e?.conditionName, value: e?.conditionCode }))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
                </Form.Item>
                <Form.Item name={["labRequiredConditions"]} label="Điều kiện phòng thực hành">
                    <Select options={conditions?.data?.data?.items?.map(e => ({ label: e?.conditionName, value: e?.conditionCode }))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
                </Form.Item>
            </div>
            <div className={"flex gap-5"}>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu cấu hình</Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default Form_create_course_class_section_config_both;