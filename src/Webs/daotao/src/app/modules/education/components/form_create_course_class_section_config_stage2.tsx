import { Button, Form, Input, InputNumber, Select } from "antd";
import type { FormInstance } from "antd/es/form/hooks/useForm";
import { useWatch } from "antd/es/form/Form";
import { Subject } from "@/domain/subject.ts";
import { useEffect, useRef, useState } from "react";
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

const THEORY_CREDITS_TO_PERIODS = 15;
const PRACTICE_CREDITS_TO_PERIODS = 15;

const Form_create_course_class_section_config_stage2 = ({
                                                            form,
                                                            subject,
                                                            semesterCode,
                                                        }: Props) => {
    const { data: conditions } = useGetConditions({});
    const lastChangedRef = useRef<"theory" | "practice" | null>(null);

    // State để điều khiển giá trị Input lý thuyết/thực hành sessions
    const [theorySessionsValue, setTheorySessionsValue] = useState("");
    const [practiceSessionsValue, setPracticeSessionsValue] = useState("");

    // Khi khởi tạo hoặc thay đổi subject, set lại các giá trị mặc định
    useEffect(() => {
        if (subject) {
            form.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject.numberOfCredits ?? 0) * THEORY_CREDITS_TO_PERIODS,
                model: {
                    theoryTotalPeriod: (subject.numberOfCredits ?? 0) * THEORY_CREDITS_TO_PERIODS,
                    practiceTotalPeriod: 0,
                },
                numberOfCredits: (subject.numberOfCredits ?? 0),
                numberOfTheoryCredits: subject.numberOfCredits ?? 0,
                numberOfPracticeCredits: 0,
                theoryWeekStart: 1,
                theoryWeekEnd: 8,
                practiceWeekStart: 3,
                practiceWeekEnd: 8,
            });
        }
    }, [subject]);

    const { mutate } = useCreateSubjectScheduleConfig();
    const { data: subjectScheduleConfigs } = useGetSubjectScheduleConfig({
        Filters: [
            { field: "SemesterCode", operator: "==", value: semesterCode || "" },
            { field: "SubjectCode", operator: "==", value: subject?.subjectCode || "" },
            { field: "Stage", operator: "==", value: "1" }
        ]
    }, subject?.subjectCode !== undefined);

    const subjectScheduleConfig = subjectScheduleConfigs?.data?.data?.items?.[0];

    useEffect(() => {
        if (subjectScheduleConfig) {
            form.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject?.numberOfCredits ?? 0) * THEORY_CREDITS_TO_PERIODS,
                model: {
                    theorySessions: subjectScheduleConfig?.theorySessions ?? [],
                    practiceSessions: subjectScheduleConfig?.practiceSessions ?? [],
                    theoryTotalPeriod: subjectScheduleConfig?.theoryTotalPeriod || 0,
                    practiceTotalPeriod: subjectScheduleConfig?.practiceTotalPeriod || 0,
                    weekStart: subjectScheduleConfig?.weekLectureStart || 1,
                    sessionPriority: subjectScheduleConfig?.sessionPriority || -1,
                    lectureRequiredConditions: subjectScheduleConfig?.lectureRequiredConditions || [],
                    labRequiredConditions: subjectScheduleConfig?.labRequiredConditions || [],
                },
                numberOfTheoryCredits: subjectScheduleConfig?.theoryTotalPeriod
                    ? Math.round(Number(subjectScheduleConfig?.theoryTotalPeriod) / THEORY_CREDITS_TO_PERIODS)
                    : 0,
                numberOfPracticeCredits: subjectScheduleConfig?.practiceTotalPeriod
                    ? Math.round(Number(subjectScheduleConfig?.practiceTotalPeriod) / PRACTICE_CREDITS_TO_PERIODS)
                    : 0,
                theoryWeekStart: subjectScheduleConfig?.weekLectureStart ?? 1,
                theoryWeekEnd: subjectScheduleConfig?.weekLectureEnd ?? 8,
                practiceWeekStart: subjectScheduleConfig?.weekLabStart ?? 3,
                practiceWeekEnd: subjectScheduleConfig?.weekLabEnd ?? 8,
            });
        }
    }, [subjectScheduleConfig, subject?.numberOfCredits]);

    // Theo dõi các trường tín chỉ
    const numberOfCredits = useWatch(['numberOfCredits'], form) ?? 0;
    const numberOfTheoryCredits = useWatch(['numberOfTheoryCredits'], form) ?? 0;
    const numberOfPracticeCredits = useWatch(['numberOfPracticeCredits'], form) ?? 0;

    // Tự điều chỉnh tổng số tín chỉ dựa vào hai trường input (giống stage1)
    useEffect(() => {
        if (!subject || typeof numberOfCredits !== "number") return;

        if (numberOfTheoryCredits === undefined && numberOfPracticeCredits === undefined) {
            form.setFieldsValue({
                numberOfTheoryCredits: numberOfCredits,
                numberOfPracticeCredits: 0
            });
            return;
        }

        if (lastChangedRef.current === "theory") {
            const newPractice = Math.max(0, numberOfCredits - Number(numberOfTheoryCredits));
            if (numberOfPracticeCredits !== newPractice) {
                form.setFieldsValue({ numberOfPracticeCredits: newPractice });
            }
        } else if (lastChangedRef.current === "practice") {
            const newTheory = Math.max(0, numberOfCredits - Number(numberOfPracticeCredits));
            if (numberOfTheoryCredits !== newTheory) {
                form.setFieldsValue({ numberOfTheoryCredits: newTheory });
            }
        } else if (numberOfTheoryCredits + numberOfPracticeCredits !== numberOfCredits) {
            form.setFieldsValue({
                numberOfTheoryCredits: numberOfCredits,
                numberOfPracticeCredits: 0
            });
        }
        lastChangedRef.current = null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfTheoryCredits, numberOfPracticeCredits, numberOfCredits, subject?.subjectCode]);

    // Tự động cập nhật số tiết dựa vào tín chỉ
    useEffect(() => {
        form.setFieldsValue({
            model: {
                ...form.getFieldValue("model"),
                theoryTotalPeriod: Number(numberOfTheoryCredits) * THEORY_CREDITS_TO_PERIODS,
                practiceTotalPeriod: Number(numberOfPracticeCredits) * PRACTICE_CREDITS_TO_PERIODS,
            }
        });
    }, [numberOfTheoryCredits, numberOfPracticeCredits]);

    // Theo dõi tiết/tuần lý thuyết
    const theoryTotalPeriod = useWatch(['model', 'theoryTotalPeriod'], form) ?? 0;
    const theoryWeekStart = useWatch(['theoryWeekStart'], form) ?? 1;
    const theoryWeekEnd = useWatch(['theoryWeekEnd'], form) ?? 1;
    const theoryNumWeeks = Math.max(1, Number(theoryWeekEnd) - Number(theoryWeekStart) + 1);
    const avgTheoryPeriodsPerWeek = theoryTotalPeriod && theoryNumWeeks > 0
        ? +(theoryTotalPeriod / theoryNumWeeks).toFixed(2)
        : 0;

    // Theo dõi tiết/tuần thực hành
    const practiceTotalPeriod = useWatch(['model', 'practiceTotalPeriod'], form) ?? 0;
    const practiceWeekStart = useWatch(['practiceWeekStart'], form) ?? 1;
    const practiceWeekEnd = useWatch(['practiceWeekEnd'], form) ?? 1;
    const practiceNumWeeks = Math.max(1, Number(practiceWeekEnd) - Number(practiceWeekStart) + 1);
    const avgPracticePeriodsPerWeek = practiceTotalPeriod && practiceNumWeeks > 0
        ? +(practiceTotalPeriod / practiceNumWeeks).toFixed(2)
        : 0;

    // Đồng bộ theorySessions value khi các trường liên quan thay đổi
    useEffect(() => {
        // Bạn có thể tùy chỉnh logic chia buổi ở đây
        if (!theoryTotalPeriod || !theoryNumWeeks) {
            setTheorySessionsValue("");
            form.setFieldsValue({
                model: {
                    ...form.getFieldValue("model"),
                    theorySessions: [],
                }
            });
            return;
        }
        // VD chia đều cho 2 buổi
        const avg = Math.max(1, Math.ceil(avgTheoryPeriodsPerWeek / 2));
        const sessionsArr = [avg, avg];
        setTheorySessionsValue(sessionsArr.join(","));
        form.setFieldsValue({
            model: {
                ...form.getFieldValue("model"),
                theorySessions: sessionsArr,
            }
        });
    }, [theoryTotalPeriod, theoryWeekStart, theoryWeekEnd, avgTheoryPeriodsPerWeek]);

    // Khi người dùng chỉnh tay ô input, vẫn cho phép nhập tự do
    const handleTheorySessionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheorySessionsValue(e.target.value);
        form.setFieldsValue({
            model: {
                ...form.getFieldValue("model"),
                theorySessions: e.target.value
                    ? e.target.value.split(",").map(Number)
                    : [],
            }
        });
    };

    // Đồng bộ practiceSessions value khi các trường liên quan thay đổi
    useEffect(() => {
        if (!practiceTotalPeriod || !practiceNumWeeks) {
            setPracticeSessionsValue("");
            form.setFieldsValue({
                model: {
                    ...form.getFieldValue("model"),
                    practiceSessions: [],
                }
            });
            return;
        }
        // VD chia hết cho 1 buổi
        const avg = Math.ceil(avgPracticePeriodsPerWeek);
        const sessionsArr = [avg];
        setPracticeSessionsValue(sessionsArr.join(","));
        form.setFieldsValue({
            model: {
                ...form.getFieldValue("model"),
                practiceSessions: sessionsArr,
            }
        });
    }, [practiceTotalPeriod, practiceWeekStart, practiceWeekEnd, avgPracticePeriodsPerWeek]);

    const handlePracticeSessionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPracticeSessionsValue(e.target.value);
        form.setFieldsValue({
            model: {
                ...form.getFieldValue("model"),
                practiceSessions: e.target.value
                    ? e.target.value.split(",").map(Number)
                    : [],
            }
        });
    };

    return (
        <Form<CreateSubjectScheduleConfigModel & {
            numberOfCredits?: number,
            numberOfTheoryCredits?: number,
            numberOfPracticeCredits?: number,
            theoryWeekStart?: number,
            theoryWeekEnd?: number,
            practiceWeekStart?: number,
            practiceWeekEnd?: number
        }>
            form={form}
            key="stage2"
            layout="vertical"
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
                },
                numberOfCredits: subject?.numberOfCredits ?? 0,
                numberOfTheoryCredits: subject?.numberOfCredits ?? 0,
                numberOfPracticeCredits: 0,
                theoryWeekStart: 1,
                theoryWeekEnd: 8,
                practiceWeekStart: 3,
                practiceWeekEnd: 8,
            }}
            //@ts-ignore
            onFinish={(values) => {
                const model: CreateSubjectScheduleConfigModel = {
                    semesterCode: semesterCode || "",
                    model: {
                        ...values.model,
                        subjectCode: subject?.subjectCode || "",
                        stage: 1,
                        theoryTotalPeriod: values.model.theoryTotalPeriod ?? 0,
                        practiceTotalPeriod: values.model.practiceTotalPeriod ?? 0,
                        theorySessions: values.model.theorySessions,
                        practiceSessions: values.model.practiceSessions,
                        weekLectureStart: values.theoryWeekStart ?? 1,
                        weekLectureEnd: values.theoryWeekEnd ?? 8,
                        weekLabStart: values.practiceWeekStart ?? 3,
                        weekLabEnd: values.practiceWeekEnd ?? 8,
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
            <div className={"flex flex-row gap-5"}>
                <Form.Item name={["numberOfCredits"]} label="Tổng số tín chỉ">
                    <InputNumber min={0} disabled />
                </Form.Item>
                <Form.Item name={"totalPeriods"} label="Tổng số tiết học">
                    <InputNumber min={0} />
                </Form.Item>
            </div>
            {/* Lý thuyết */}
            <div className={"w-full flex flex-row gap-5 items-end"}>
                <Form.Item
                    label="Số tín chỉ lý thuyết"
                    name={["numberOfTheoryCredits"]}
                >
                    <InputNumber
                        min={0}
                        max={numberOfCredits}
                        onChange={() => { lastChangedRef.current = "theory"; }}
                    />
                </Form.Item>
                <Form.Item
                    name={["model", "theoryTotalPeriod"]}
                    label="Số tiết lý thuyết"
                >
                    <InputNumber min={0}  />
                </Form.Item>
                <Form.Item name={["theoryWeekStart"]} label="Tuần bắt đầu">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["theoryWeekEnd"]} label="Tuần kết thúc">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Số tiết lý thuyết TB/tuần" style={{ minWidth: 160 }}>
                    <InputNumber value={Math.ceil(avgTheoryPeriodsPerWeek)} disabled style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Quy định về lịch học lý thuyết"
                    name={["model", "theorySessions"]}
                    help={"VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)"}
                >
                    <Input
                        value={theorySessionsValue}
                        onChange={handleTheorySessionsChange}
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
            </div>
            {/* Thực hành */}
            <div className={"w-full flex flex-row gap-5 items-end"}>
                <Form.Item
                    label="Số tín chỉ thực hành"
                    name={["numberOfPracticeCredits"]}
                >
                    <InputNumber
                        min={0}
                        max={numberOfCredits}
                        onChange={() => { lastChangedRef.current = "practice"; }}
                    />
                </Form.Item>
                <Form.Item
                    name={["model", "practiceTotalPeriod"]}
                    label="Số tiết thực hành"
                >
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item name={["practiceWeekStart"]} label="Tuần bắt đầu">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["practiceWeekEnd"]} label="Tuần kết thúc">
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Số tiết thực hành TB/tuần" style={{ minWidth: 160 }}>
                    <InputNumber value={Math.ceil(avgPracticePeriodsPerWeek)} disabled style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Quy định lịch học thực hành"
                    name={["model", "practiceSessions"]}
                    help={"VD: 3,2,2 (3 tiết buổi 1, 2 tiết buổi 2, 2 tiết buổi 3)"}
                >
                    <Input
                        value={practiceSessionsValue}
                        onChange={handlePracticeSessionsChange}
                        onClick={e => e.stopPropagation()}
                        placeholder="Tự nhập VD: 3,2,2"
                    />
                </Form.Item>
            </div>
            <Form.Item name={["model", "sessionPriority"]} label="Ưu tiên buổi học">
                <Select
                    options={[
                        { value: 0, label: "Sáng" },
                        { value: 1, label: "Chiều" },
                        { value: -1, label: "Không ưu tiên" }
                    ]}
                />
            </Form.Item>
            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select options={conditions?.data?.data?.items?.map(e => ({
                    label: e?.conditionName,
                    value: e?.conditionCode
                }))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>
            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({
                    label: e?.conditionName,
                    value: e?.conditionCode
                }))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>
            <div className={"flex gap-5"}>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Lưu cấu hình</Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default Form_create_course_class_section_config_stage2;