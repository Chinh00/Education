import { Button, Form, Input, InputNumber, Select } from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";
import { useWatch } from "antd/es/form/Form";
import { Subject } from "@/domain/subject.ts";
import { useEffect } from "react";
import { useGetConditions } from "@/app/modules/common/hook.ts";
import {
    CreateSubjectScheduleConfigModel,
} from "@/app/modules/education/services/courseClass.service.ts";
import useCreateSubjectScheduleConfig from "@/app/modules/education/hooks/useCreateSubjectScheduleConfig.ts";
import toast from "react-hot-toast";
import { useGetSubjectScheduleConfig } from "@/app/modules/education/hooks/useGetSubjectScheduleConfig.ts";

export type Props = {
    form: FormInstance,
    subject?: Subject,
    semesterCode?: string,
};

const Form_create_course_class_section_config_stage1 = ({
                                                            form,
                                                            subject,
                                                            semesterCode,
                                                        }: Props) => {
    const { data: conditions } = useGetConditions({});

    const handleTheoryChange = (value: number | null) => {
        const total = form.getFieldValue("totalPeriods") || 0;
        if (typeof value === "number" && value >= 0) {
            form.setFieldsValue({
                model: {
                    ...form.getFieldValue("model"),
                    theoryTotalPeriod: value,
                    practiceTotalPeriod: Math.max(0, total - value)
                }
            });
        }
    };

    const handlePracticeChange = (value: number | null) => {
        const total = form.getFieldValue("totalPeriods") || 0;
        if (typeof value === "number" && value >= 0) {
            form.setFieldsValue({
                model: {
                    ...form.getFieldValue("model"),
                    practiceTotalPeriod: value,
                    theoryTotalPeriod: Math.max(0, total - value)
                }
            });
        }
    };

    useEffect(() => {
        if (subject) {
            form.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                model: {
                    theoryTotalPeriod: (subject.numberOfCredits ?? 0) * 15
                }
            });
        }
    }, [subject]);

    const { mutate } = useCreateSubjectScheduleConfig();
    const { data: subjectScheduleConfigs } = useGetSubjectScheduleConfig({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semesterCode || ""
            },
            {
                field: "SubjectCode",
                operator: "==",
                value: subject?.subjectCode || ""
            },
            {
                field: "Stage",
                operator: "==",
                value: "0"
            }
        ]
    }, subject?.subjectCode !== undefined);

    const subjectScheduleConfig = subjectScheduleConfigs?.data?.data?.items?.[0];

    useEffect(() => {
        if (subjectScheduleConfig) {
            form.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject?.numberOfCredits ?? 0) * 15,
                model: {
                    theorySessions: subjectScheduleConfig?.theorySessions ?? [],
                    practiceSessions: subjectScheduleConfig?.practiceSessions ?? [],
                    theoryTotalPeriod: subjectScheduleConfig?.theoryTotalPeriod || 0,
                    practiceTotalPeriod: subjectScheduleConfig?.practiceTotalPeriod || 0,
                    weekStart: subjectScheduleConfig?.weekStart || 1,
                    sessionPriority: subjectScheduleConfig?.sessionPriority || -1,
                    lectureRequiredConditions: subjectScheduleConfig?.lectureRequiredConditions || [],
                    labRequiredConditions: subjectScheduleConfig?.labRequiredConditions || [],
                }
            });
        }
    }, [subjectScheduleConfig]);

    return (
        <Form<CreateSubjectScheduleConfigModel>
            form={form}
            key="stage1"
            layout="horizontal"
            initialValues={{
                semesterCode: semesterCode,
                model: {
                    subjectCode: subject?.subjectCode || "",
                    theoryTotalPeriod: 0,
                    practiceTotalPeriod: 0,
                    theorySessions: "",
                    practiceSessions: "",
                    weekStart: 3,
                    lectureRequiredConditions: ["Lecture"],
                    labRequiredConditions: [],
                    totalPeriods: 0,
                }
            }}
            onFinish={(values) => {
                const model: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        ...values.model,
                        subjectCode: subject?.subjectCode || "",
                        stage: 0,
                        theoryTotalPeriod: values.model.theoryTotalPeriod ?? 0,
                        practiceTotalPeriod: values.model.practiceTotalPeriod ?? 0,
                        theorySessions: values.model.theorySessions,
                        practiceSessions: values.model.practiceSessions,
                        weekStart: values.model.weekStart ?? 1,
                        sessionPriority: values.model.sessionPriority ?? -1,
                        lectureRequiredConditions: values.model.lectureRequiredConditions || [],
                        labRequiredConditions: values.model.labRequiredConditions || [],
                    }
                };
                mutate(model, {
                    onSuccess: () => {
                        toast.success("Lưu cấu hình thành công");
                    },
                    onError: () => {
                        toast.error("Lưu cấu hình thất bại, Có lỗi xảy ra");
                    }
                });
            }}
            className={"grid gap-4"}
        >
            <Form.Item name={"totalPeriods"} label="Tổng số tiết học" >
                <InputNumber min={0} />
            </Form.Item>
            <div className={"w-full grid grid-cols-3"}>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "theoryTotalPeriod"]}
                    label="Tổng số tiết lý thuyết"
                >
                    <InputNumber min={0} onChange={handleTheoryChange} />
                </Form.Item>
                <Form.Item
                    label="Quy định về lịch học lý thuyết"
                    name={["model", "theorySessions"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={(e) => {
                            form.setFieldsValue({
                                model: {
                                    ...form.getFieldValue("model"),
                                    theorySessions: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
            </div>
            <div className={"w-full grid grid-cols-3"}>
                <Form.Item
                    name={["model", "practiceTotalPeriod"]}
                    label="Tổng số tiết thực hành"
                >
                    <InputNumber min={0} onChange={handlePracticeChange} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học thực hành"
                    name={["model", "practiceSessions"]}
                >
                    <Input
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                        onChange={(e) => {
                            form.setFieldsValue({
                                model: {
                                    ...form.getFieldValue("model"),
                                    practiceSessions: [...e.target.value?.split(",")?.map(Number)],
                                },
                            });
                        }}
                    />
                </Form.Item>
            </div>
            <Form.Item name={["model", "weekStart"]} label="Tuần bắt đầu học thực hành (nếu có)" >
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name={["model", "sessionPriority"]} label="Ưu tiên buổi học" >
                <Select
                    options={[
                        { value: 0, label: "Sáng" },
                        { value: 1, label: "Chiều" },
                        { value: -1, label: "Không ưu tiên" }
                    ]}
                />
            </Form.Item>
            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select options={conditions?.data?.data?.items?.map(e => ({ label: e?.conditionName, value: e?.conditionCode }))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>
            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({ label: e?.conditionName, value: e?.conditionCode }))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>
            <div className={"flex gap-5"}>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu cấu hình</Button>
                </Form.Item>
            </div>
        </Form>
    );
};
export default Form_create_course_class_section_config_stage1;