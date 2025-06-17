import { Button, Form, Input, InputNumber, Select } from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";
import { useEffect } from "react";
import { useGetConditions } from "@/app/modules/common/hook.ts";
import {
    SubjectScheduleConfigBothModel,
} from "@/app/modules/education/services/courseClass.service.ts";
import { Subject } from "@/domain/subject.ts";

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

    const totalPeriods = Form.useWatch("totalPeriods", formBoth);

    const handleTotalPeriodOfStage1Change = (value: number | null) => {
        const total = formBoth?.getFieldValue("totalPeriods") || 0;
        const val1 = Math.max(0, Math.min(value || 0, total));
        formBoth?.setFieldsValue({
            model: {
                ...formBoth?.getFieldValue("model"),
                totalPeriodOfStage1: val1,
                totalPeriodOfStage2: total - val1
            }
        });
    };

    // --- GIAI ĐOẠN 1 ---
    const handleTheoryPeriodOfStage1Change = (value: number | null) => {
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

    const handlePracticePeriodOfStage1Change = (value: number | null) => {
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

    // --- GIAI ĐOẠN 2 ---
    const handleTheoryPeriodOfStage2Change = (value: number | null) => {
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

    const handlePracticePeriodOfStage2Change = (value: number | null) => {
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

    useEffect(() => {
        if (typeof totalPeriods === "number") {
            const currModel = formBoth?.getFieldValue("model") || {};
            const val1 = currModel.totalPeriodOfStage1 ?? 0;
            if (val1 > totalPeriods) {
                formBoth?.setFieldsValue({
                    model: {
                        ...currModel,
                        totalPeriodOfStage1: totalPeriods,
                        totalPeriodOfStage2: 0
                    }
                });
            } else {
                formBoth?.setFieldsValue({
                    model: {
                        ...currModel,
                        totalPeriodOfStage2: totalPeriods - (val1 ?? 0)
                    }
                });
            }
        }
    }, [totalPeriods]);

    useEffect(() => {
        if (subject) {
            formBoth.setFieldsValue({
                ...formBoth.getFieldValue("model"),
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                model: {
                    theoryTotalPeriod: (subject.numberOfCredits ?? 0) * 15
                }
            });
        }
    }, [subject]);

    return (
        <Form<SubjectScheduleConfigBothModel>
            form={formBoth}
            key="stageBoth"
            layout="horizontal"
            initialValues={{
                semesterCode: semesterCode,
                model: {
                    subjectCode: subject?.subjectCode || "",
                    totalPeriodOfStage1: 21,
                    totalPeriodOfStage2: 24,
                    theoryTotalPeriodOfStage1: 21,
                    theoryTotalPeriodOfStage2: 24,
                    practiceTotalPeriod: 0,
                    theorySessions: "",
                    practiceSessions: "",
                    weekStart: 3,
                    sessionPriorityOfStage1: -1,
                    sessionPriorityOfStage2: -1,
                    lectureRequiredConditions: ["Lecture"],
                    labRequiredConditions: [],
                    totalPeriods: 0,
                }
            }}
            onFinish={(values) => {
                console.log(values);
            }}
            className={"grid grid-cols-4 gap-4"}
        >
            <Form.Item className={"col-span-4"} name={"totalPeriods"} label="Tổng số tiết học" >
                <InputNumber min={0} />
            </Form.Item>
            {/* Giai doan 1*/}
            <div className={"w-full col-span-2"}>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "totalPeriodOfStage1"]}
                    label="Tổng số tiết GD1"
                >
                    <InputNumber min={0} onChange={handleTotalPeriodOfStage1Change} />
                </Form.Item>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "theoryTotalPeriodOfStage1"]}
                    label="Số tiết lý thuyết GD1"
                >
                    <InputNumber min={0} onChange={handleTheoryPeriodOfStage1Change} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học lý thuyết GD1"
                    name={["model", "theorySessionsOfStage1"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
                <Form.Item
                    name={["model", "practiceTotalPeriodOfStage1"]}
                    label="Số tiết thực hành"
                >
                    <InputNumber min={0} onChange={handlePracticePeriodOfStage1Change} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học thực hành GD1"
                    name={["model", "practiceSessionsOfStage1"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
                <Form.Item name={["model", "sessionPriorityOfStage1"]} label="Ưu tiên buổi học" >
                    <Select
                        options={[
                            { value: 0, label: "Sáng" },
                            { value: 1, label: "Chiều" },
                            { value: -1, label: "Không ưu tiên" }
                        ]}
                    />
                </Form.Item>
            </div>
            {/* Giai doan 2*/}
            <div className={"w-full  col-span-2"}>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "totalPeriodOfStage2"]}
                    label="Tổng số tiết GD2"
                >
                    <InputNumber min={0} onChange={handleTotalPeriodOfStage1Change} />
                </Form.Item>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "theoryTotalPeriodOfStage2"]}
                    label="Số tiết lý thuyết giai đoạn 2"
                >
                    <InputNumber min={0} onChange={handleTheoryPeriodOfStage2Change} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học lý thuyết GD2"
                    name={["model", "theorySessionsOfStage2"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
                <Form.Item
                    name={["model", "practiceTotalPeriodOfStage2"]}
                    label="Số tiết thực hành GD2"
                >
                    <InputNumber min={0} onChange={handlePracticePeriodOfStage2Change} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học thực hành"
                    name={["model", "practiceSessionsOfStage2"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
                <Form.Item name={["model", "sessionPriorityOfStage2"]} label="Ưu tiên buổi học" >
                    <Select
                        options={[
                            { value: 0, label: "Sáng" },
                            { value: 1, label: "Chiều" },
                            { value: -1, label: "Không ưu tiên" }
                        ]}
                    />
                </Form.Item>
            </div>
            <Form.Item name={["model", "weekStart"]} label="Tuần bắt đầu học thực hành (nếu có)" >
                <InputNumber min={0} />
            </Form.Item>
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