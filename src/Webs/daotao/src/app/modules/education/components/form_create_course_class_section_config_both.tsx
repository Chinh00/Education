import { Button, Form, Input, InputNumber, Select } from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import { useWatch } from "antd/es/form/Form";
import { useGetConditions } from "@/app/modules/common/hook.ts";
import {
    CreateSubjectScheduleConfigModel,
} from "@/app/modules/education/services/courseClass.service.ts";
import { Subject } from "@/domain/subject.ts";
import useCreateSubjectScheduleConfig from "@/app/modules/education/hooks/useCreateSubjectScheduleConfig.ts";
import toast from "react-hot-toast";
import { useGetSubjectScheduleConfig } from "@/app/modules/education/hooks/useGetSubjectScheduleConfig.ts";

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
    const totalPeriodOfStage1 = useWatch(['model', 'totalPeriodOfStage1'], formBoth) ?? 0;
    const totalPeriodOfStage2 = useWatch(['model', 'totalPeriodOfStage2'], formBoth) ?? 0;

    // Lý thuyết/thực hành GD1
    const theoryTotalPeriodOfStage1 = useWatch(['model', 'theoryTotalPeriodOfStage1'], formBoth) ?? 0;
    const practiceTotalPeriodOfStage1 = useWatch(['model', 'practiceTotalPeriodOfStage1'], formBoth) ?? 0;
    // Lý thuyết/thực hành GD2
    const theoryTotalPeriodOfStage2 = useWatch(['model', 'theoryTotalPeriodOfStage2'], formBoth) ?? 0;
    const practiceTotalPeriodOfStage2 = useWatch(['model', 'practiceTotalPeriodOfStage2'], formBoth) ?? 0;

    // Tự động cập nhật tổng số tiết của từng giai đoạn khi tổng số tiết hoặc giai đoạn thay đổi
    useEffect(() => {
        const val1 = Number(totalPeriodOfStage1) || 0;
        if (val1 > totalPeriods) {
            formBoth?.setFieldsValue({
                model: {
                    ...formBoth.getFieldValue("model"),
                    totalPeriodOfStage1: totalPeriods,
                    totalPeriodOfStage2: 0
                }
            });
        } else {
            formBoth?.setFieldsValue({
                model: {
                    ...formBoth.getFieldValue("model"),
                    totalPeriodOfStage2: totalPeriods - val1
                }
            });
        }
    }, [totalPeriods, totalPeriodOfStage1]);

    // Tự động cập nhật thực hành khi thay đổi lý thuyết (và ngược lại) trong từng giai đoạn
    const handleTheoryOfStage1Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["model", "totalPeriodOfStage1"]) || 0;
        const theory = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            model: {
                ...formBoth.getFieldValue("model"),
                theoryTotalPeriodOfStage1: theory,
                practiceTotalPeriodOfStage1: total - theory
            }
        });
    };
    const handlePracticeOfStage1Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["model", "totalPeriodOfStage1"]) || 0;
        const practice = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            model: {
                ...formBoth.getFieldValue("model"),
                practiceTotalPeriodOfStage1: practice,
                theoryTotalPeriodOfStage1: total - practice
            }
        });
    };
    const handleTheoryOfStage2Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["model", "totalPeriodOfStage2"]) || 0;
        const theory = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            model: {
                ...formBoth.getFieldValue("model"),
                theoryTotalPeriodOfStage2: theory,
                practiceTotalPeriodOfStage2: total - theory
            }
        });
    };
    const handlePracticeOfStage2Change = (value: number | null) => {
        const total = formBoth?.getFieldValue(["model", "totalPeriodOfStage2"]) || 0;
        const practice = Math.max(0, Math.min(value ?? 0, total));
        formBoth?.setFieldsValue({
            model: {
                ...formBoth.getFieldValue("model"),
                practiceTotalPeriodOfStage2: practice,
                theoryTotalPeriodOfStage2: total - practice
            }
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
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                model: {
                    ...formBoth.getFieldValue("model"),
                }
            });
        }
    }, [subject]);

    useEffect(() => {
        if (subjectScheduleConfigs) {
            const stage1Config = subjectScheduleConfigs?.data?.data?.items?.find(e => e.stage === 2);
            const stage2Config = subjectScheduleConfigs?.data?.data?.items?.find(e => e.stage === 3);
            if (stage1Config) {
                formBoth.setFieldsValue({
                    model: {
                        ...formBoth.getFieldValue("model"),
                        totalPeriodOfStage1: (stage1Config.theoryTotalPeriod ?? 0) + (stage1Config.practiceTotalPeriod ?? 0),
                        theoryTotalPeriodOfStage1: stage1Config.theoryTotalPeriod ?? 0,
                        practiceTotalPeriodOfStage1: stage1Config.practiceTotalPeriod ?? 0,
                        theorySessionsOfStage1: stage1Config.theorySessions,
                        practiceSessionsOfStage1: stage1Config.practiceSessions,
                        theoryWeekStartStage1: stage1Config.theoryWeekStart ?? 1,
                        theoryWeekEndStage1: stage1Config.theoryWeekEnd ?? 8,
                        practiceWeekStartStage1: stage1Config.practiceWeekStart ?? 1,
                        practiceWeekEndStage1: stage1Config.practiceWeekEnd ?? 8,
                        sessionPriorityOfStage1: stage1Config.sessionPriority,
                        lectureRequiredConditions: stage1Config.lectureRequiredConditions || [],
                        labRequiredConditions: stage1Config.labRequiredConditions || [],
                    }
                });
            }
            if (stage2Config) {
                formBoth.setFieldsValue({
                    model: {
                        ...formBoth.getFieldValue("model"),
                        totalPeriodOfStage2: (stage2Config.theoryTotalPeriod ?? 0) + (stage2Config.practiceTotalPeriod ?? 0),
                        theoryTotalPeriodOfStage2: stage2Config.theoryTotalPeriod ?? 0,
                        practiceTotalPeriodOfStage2: stage2Config.practiceTotalPeriod ?? 0,
                        theorySessionsOfStage2: stage2Config.theorySessions,
                        practiceSessionsOfStage2: stage2Config.practiceSessions,
                        theoryWeekStartStage2: stage2Config.theoryWeekStart ?? 1,
                        theoryWeekEndStage2: stage2Config.theoryWeekEnd ?? 8,
                        practiceWeekStartStage2: stage2Config.practiceWeekStart ?? 1,
                        practiceWeekEndStage2: stage2Config.practiceWeekEnd ?? 8,
                        sessionPriorityOfStage2: stage2Config.sessionPriority,
                    }
                });
            }
        }
    }, [subjectScheduleConfigs]);

    return (
        <Form
            form={formBoth}
            key="stageBoth"
            layout="vertical"
            initialValues={{
                semesterCode: semesterCode,
                model: {
                    subjectCode: subject?.subjectCode || "",
                    totalPeriodOfStage1: 0,
                    totalPeriodOfStage2: 0,
                    theoryTotalPeriodOfStage1: 0,
                    theoryTotalPeriodOfStage2: 0,
                    practiceTotalPeriodOfStage1: 0,
                    practiceTotalPeriodOfStage2: 0,
                    theoryWeekStartStage1: 1,
                    theoryWeekEndStage1: 8,
                    practiceWeekStartStage1: 1,
                    practiceWeekEndStage1: 8,
                    theoryWeekStartStage2: 1,
                    theoryWeekEndStage2: 8,
                    practiceWeekStartStage2: 1,
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
                }
            }}
            onFinish={(values) => {
                const modelOfStage1: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        subjectCode: subject?.subjectCode || "",
                        stage: 2,
                        theoryTotalPeriod: values?.model.theoryTotalPeriodOfStage1 ?? 0,
                        practiceTotalPeriod: values?.model.practiceTotalPeriodOfStage1 ?? 0,
                        theorySessions: values?.model.theorySessionsOfStage1,
                        practiceSessions: values?.model.practiceSessionsOfStage1,
                        weekLectureStart: values?.model.theoryWeekStartStage1 ?? 1,
                        weekLectureEnd: values?.model.theoryWeekEndStage1 ?? 8,
                        weekLabStart: values?.model.practiceWeekStartStage1 ?? 1,
                        weekLabEnd: values?.model.practiceWeekEndStage1 ?? 8,
                        sessionPriority: values?.model.sessionPriorityOfStage1 ?? -1,
                        lectureRequiredConditions: values?.model.lectureRequiredConditions || [],
                        labRequiredConditions: values?.model.labRequiredConditions || [],
                    }
                };
                const modelOfStage2: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        subjectCode: subject?.subjectCode || "",
                        stage: 3,
                        theoryTotalPeriod: values?.model.theoryTotalPeriodOfStage2 ?? 0,
                        practiceTotalPeriod: values?.model.practiceTotalPeriodOfStage2 ?? 0,
                        theorySessions: values?.model.theorySessionsOfStage2,
                        practiceSessions: values?.model.practiceSessionsOfStage2,
                        weekLectureStart: values?.model.theoryWeekStartStage2 ?? 1,
                        weekLectureEnd: values?.model.theoryWeekEndStage2 ?? 8,
                        weekLabStart: values?.model.practiceWeekStartStage2 ?? 1,
                        weekLabEnd: values?.model.practiceWeekEndStage2 ?? 8,
                        sessionPriority: values?.model.sessionPriorityOfStage2 ?? -1,
                        lectureRequiredConditions: values?.model.lectureRequiredConditions || [],
                        labRequiredConditions: values?.model.labRequiredConditions || [],
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
            <Form.Item className={"col-span-4"} name={"totalPeriods"} label="Tổng số tiết học" >
                <InputNumber min={0} />
            </Form.Item>
            {/* Giai đoạn 1 */}
            <div className="w-full col-span-2 border rounded-md p-4 bg-gray-50">
                <div className="font-semibold mb-3">Giai đoạn 1</div>
                <Form.Item name={["model", "totalPeriodOfStage1"]} label="Tổng số tiết GD1">
                    <InputNumber min={0} max={totalPeriods} />
                </Form.Item>
                <Form.Item name={["model", "theoryTotalPeriodOfStage1"]} label="Số tiết lý thuyết GD1">
                    <InputNumber min={0} max={totalPeriodOfStage1} onChange={handleTheoryOfStage1Change} />
                </Form.Item>
                <Form.Item name={["model", "practiceTotalPeriodOfStage1"]} label="Số tiết thực hành GD1">
                    <InputNumber min={0} max={totalPeriodOfStage1} onChange={handlePracticeOfStage1Change} />
                </Form.Item>
                <Form.Item name={["model", "theoryWeekStartStage1"]} label="Tuần bắt đầu lý thuyết GD1">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["model", "theoryWeekEndStage1"]} label="Tuần kết thúc lý thuyết GD1">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Quy định lịch học lý thuyết GD1" name={["model", "theorySessionsOfStage1"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldValue("model"),
                                    theorySessionsOfStage1: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["model", "practiceWeekStartStage1"]} label="Tuần bắt đầu thực hành GD1">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["model", "practiceWeekEndStage1"]} label="Tuần kết thúc thực hành GD1">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Quy định lịch học thực hành GD1" name={["model", "practiceSessionsOfStage1"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldValue("model"),
                                    practiceSessionsOfStage1: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["model", "sessionPriorityOfStage1"]} label="Ưu tiên buổi học GD1">
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
                <Form.Item name={["model", "totalPeriodOfStage2"]} label="Tổng số tiết GD2">
                    <InputNumber min={0} max={totalPeriods} />
                </Form.Item>
                <Form.Item name={["model", "theoryTotalPeriodOfStage2"]} label="Số tiết lý thuyết GD2">
                    <InputNumber min={0} max={totalPeriodOfStage2} onChange={handleTheoryOfStage2Change} />
                </Form.Item>
                <Form.Item name={["model", "practiceTotalPeriodOfStage2"]} label="Số tiết thực hành GD2">
                    <InputNumber min={0} max={totalPeriodOfStage2} onChange={handlePracticeOfStage2Change} />
                </Form.Item>
                <Form.Item name={["model", "theoryWeekStartStage2"]} label="Tuần bắt đầu lý thuyết GD2">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["model", "theoryWeekEndStage2"]} label="Tuần kết thúc lý thuyết GD2">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Quy định lịch học lý thuyết GD2" name={["model", "theorySessionsOfStage2"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldValue("model"),
                                    theorySessionsOfStage2: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["model", "practiceWeekStartStage2"]} label="Tuần bắt đầu thực hành GD2">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["model", "practiceWeekEndStage2"]} label="Tuần kết thúc thực hành GD2">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Quy định lịch học thực hành GD2" name={["model", "practiceSessionsOfStage2"]} help="VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)">
                    <Input
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={e => {
                            formBoth.setFieldsValue({
                                model: {
                                    ...formBoth.getFieldValue("model"),
                                    practiceSessionsOfStage2: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item name={["model", "sessionPriorityOfStage2"]} label="Ưu tiên buổi học GD2">
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
                <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                    <Select options={conditions?.data?.data?.items?.map(e => ({ label: e?.conditionName, value: e?.conditionCode }))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
                </Form.Item>
                <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
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