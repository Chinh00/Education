import {Button, Form, Input, InputNumber, Select, Radio} from "antd";
import type {FormInstance} from "antd/es/form/hooks/useForm";
import {useWatch} from "antd/es/form/Form";
import { getPeriodSessionOptions } from "../pages/periodSessionSuggestions";
import {Subject} from "@/domain/subject.ts";
import {useEffect} from "react";
import {useGetConditions} from "@/app/modules/common/hook.ts";
import {SubjectScheduleConfigBothModel} from "@/app/modules/education/services/courseClass.service.ts";

export type Form_create_course_class_section_configProps = {
    stage: number,
    form: FormInstance,
    formBoth?: FormInstance,
    subject?: Subject,
    semesterCode?: string,
    onSubmit: (data: FormInstance) => void,
}

const Form_create_course_class_section_config = ({
                                                     stage, 
                                                     form,
                                                     subject,
                                                     semesterCode,
                                                     onSubmit,
                                                     formBoth
}: Form_create_course_class_section_configProps) => {
    const {data: conditions} = useGetConditions({})


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

    const theoryTotalPeriod = useWatch(["model", "theoryTotalPeriod"], form);
    const practiceTotalPeriod = useWatch(["model", "practiceTotalPeriod"], form);

    useEffect(() => {
        if (subject) {
            form.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                model: {
                    theoryTotalPeriod: (subject.numberOfCredits ?? 0) * 15
                }
            });
            formBoth?.setFieldsValue({
                ...form.getFieldValue("model"),
                totalPeriods: (subject.numberOfCredits ?? 0) * 15,
                model: {
                    theoryTotalPeriod: (subject.numberOfCredits ?? 0) * 15
                }
            });
            
        }
    }, [subject]);


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
    
    
    if (stage === 0 || stage === 1) {
        return <Form
            form={form}
            layout="horizontal"
            initialValues={{
                semesterCode: semesterCode,
                model: {
                    subjectCode: subject?.subjectCode || "",
                    totalTheoryCourseClass: 1,
                    stage: 0,
                    theoryTotalPeriod: 0,
                    practiceTotalPeriod: 0,
                    theorySessions: "",
                    practiceSessions: "",
                    weekStart: 1,
                    sessionPriority: 0,
                    lectureRequiredConditions: [],
                    labRequiredConditions: [],
                    totalPeriods: 0,
                }
            }}
            onFinish={(values) => {
                console.log(values)
            }}
            className={"grid gap-4"}
        >
            <Form.Item name={"totalPeriods"} label="Tổng số tiết học" rules={[{required: true}]}>
                <InputNumber min={0} />
            </Form.Item>


            <div className={"w-full grid grid-cols-3"}>
                <Form.Item
                    className={"col-span-1"}
                    name={["model", "theoryTotalPeriod"]}
                    label="Tổng số tiết lý thuyết"
                    rules={[{required: true}]}
                >
                    <InputNumber min={0} onChange={handleTheoryChange} />
                </Form.Item>
                <Form.Item
                    label="Lịch học gợi ý"
                    name={["model", "theorySessions"]} // lưu giá trị được chọn
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                            <Radio
                                value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                                {e.label}
                            </Radio>
                        ))}
                        <Radio value={"custom"}>
                            <Input
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Tự nhập VD: 3,2,2"
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        model: {
                                            ...form.getFieldValue("model"),
                                            theorySessions: e.target.value?.split(",")?.map(Number),
                                        },
                                    });
                                }}
                            />
                        </Radio>
                    </Radio.Group>
                </Form.Item>



            </div>

            <div className={"w-full grid grid-cols-3"}>
                <Form.Item
                    name={["model", "practiceTotalPeriod"]}
                    label="Tổng số tiết thực hành"
                    rules={[{required: true}]}
                >
                    <InputNumber min={0} onChange={handlePracticeChange} />
                </Form.Item>
                {!!practiceTotalPeriod && <div className={"flex flex-col gap-2"}>
                    <Form.Item
                        label="Lịch học gợi ý"
                        name={["model", "practiceSessions"]}
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                                <Radio
                                    value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                                    {e.label}
                                </Radio>
                            ))}
                            <Radio value="practiceSessionscustom">
                                <Input
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Tự nhập VD: 3,2,2"
                                    onChange={(e) => {
                                        form.setFieldsValue({
                                            model: {
                                                ...form.getFieldValue("model"),
                                                theorySessions: e.target.value?.split(",")?.map(Number),
                                            },
                                        });
                                    }}
                                />
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>}

            </div>



            <Form.Item name={["model", "weekStart"]} label="Tuần bắt đầu học thực hành (nếu có)" rules={[{required: true}]}>
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item name={["model", "sessionPriority"]} label="Ưu tiên buổi học" rules={[{required: true}]}>
                <Select
                    options={[
                        {value: 0, label: "Sáng"},
                        {value: 1, label: "Chiều"},
                        {value: 2, label: "Không ưu tiên"}
                    ]}
                />
            </Form.Item>

            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>

            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>
            <Form.Item name={["model", "totalTheoryCourseClass"]} label="Số lớp học phần cần tạo" rules={[{required: true}]}>
                <InputNumber min={1} />
            </Form.Item>
            <div className={"flex gap-5"}>
                <Form.Item

                >
                    <Button type="primary" htmlType="submit" 

                    >
                        Tạo lớp học phần tự động
                    </Button>
                </Form.Item>
                <div></div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Tạo lớp học phần thủ công
                    </Button>
                </Form.Item>
            </div>
        </Form>
        
    }
    
    
    
    return <Form<SubjectScheduleConfigBothModel>
        form={formBoth}
        layout="horizontal"
        initialValues={{
            semesterCode: semesterCode,
            model: {
                subjectCode: subject?.subjectCode || "",
                totalTheoryCourseClass: 1,
                stage: 0,
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
                lectureRequiredConditions: [],
                labRequiredConditions: [],
                totalPeriods: 0,
            }
        }}
        onFinish={(values) => {
            console.log(values)
        }}
        className={"grid grid-cols-4 gap-4"}
    >
        <Form.Item className={"col-span-4"} name={"totalPeriods"} label="Tổng số tiết học" rules={[{required: true}]}>
            <InputNumber min={0} />
        </Form.Item>


        {/* Giai doan 1*/}
        <div className={"w-full col-span-2"}>
            <Form.Item
                className={"col-span-1"}
                name={["model", "totalPeriodOfStage1"]}
                label="Tổng số tiết GD1"
                rules={[{required: true}]}
                
            >
                <InputNumber min={0} onChange={handleTotalPeriodOfStage1Change} />
            </Form.Item>
            <Form.Item
                className={"col-span-1"}
                name={["model", "theoryTotalPeriodOfStage1"]}
                label="Số tiết lý thuyết giai đoạn 1"
                rules={[{required: true}]}
            >
                <InputNumber min={0} onChange={handleTheoryPeriodOfStage1Change} />
            </Form.Item>
            <Form.Item
                label="Lịch học gợi ý"
                name={["model", "theorySessionsOfStage1"]}
                rules={[{ required: true }]}
            >
                <Radio.Group>
                    {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                        <Radio
                            value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                            {e.label}
                        </Radio>
                    ))}
                    <Radio value={"custom"}>
                        <Input
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Tự nhập VD: 3,2,2"
                            onChange={(e) => {
                                form.setFieldsValue({
                                    model: {
                                        ...form.getFieldValue("model"),
                                        theorySessions: e.target.value?.split(",")?.map(Number),
                                    },
                                });
                            }}
                        />
                    </Radio>
                </Radio.Group>
            </Form.Item>
            
            
            <Form.Item
                name={["model", "practiceTotalPeriodOfStage1"]}
                label="Số tiết thực hành"
                rules={[{required: true}]}
            >
                <InputNumber min={0} onChange={handlePracticePeriodOfStage1Change} />
            </Form.Item>
            {!!practiceTotalPeriod && <div className={"flex flex-col gap-2"}>
                <Form.Item
                    label="Lịch học gợi ý"
                    name={["model", "practiceSessions"]}
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                            <Radio
                                value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                                {e.label}
                            </Radio>
                        ))}
                        <Radio value="practiceSessionscustom">
                            <Input
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Tự nhập VD: 3,2,2"
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        model: {
                                            ...form.getFieldValue("model"),
                                            theorySessions: e.target.value?.split(",")?.map(Number),
                                        },
                                    });
                                }}
                            />
                        </Radio>
                    </Radio.Group>
                </Form.Item>
            </div>}
            <Form.Item name={["model", "sessionPriorityOfStage1"]} label="Ưu tiên buổi học" rules={[{required: true}]}>
                <Select
                    options={[
                        {value: 0, label: "Sáng"},
                        {value: 1, label: "Chiều"},
                        {value: -1, label: "Không ưu tiên"}
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
                rules={[{required: true}]}
            >
                <InputNumber min={0} onChange={handleTotalPeriodOfStage1Change} />
            </Form.Item>
            <Form.Item
                className={"col-span-1"}
                name={["model", "theoryTotalPeriodOfStage2"]}
                label="Số tiết lý thuyết giai đoạn 2"
                rules={[{required: true}]}
            >
                <InputNumber min={0} onChange={handleTheoryPeriodOfStage2Change} />
            </Form.Item>
            <Form.Item
                label="Lịch học gợi ý"
                name={["model", "theorySessionsOfStage2"]} // lưu giá trị được chọn
                rules={[{ required: true }]}
            >
                <Radio.Group>
                    {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                        <Radio
                            value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                            {e.label}
                        </Radio>
                    ))}
                    <Radio value={"custom"}>
                        <Input
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Tự nhập VD: 3,2,2"
                            onChange={(e) => {
                                form.setFieldsValue({
                                    model: {
                                        ...form.getFieldValue("model"),
                                        theorySessions: e.target.value?.split(",")?.map(Number),
                                    },
                                });
                            }}
                        />
                    </Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                name={["model", "practiceTotalPeriodOfStage2"]}
                label="Số tiết thực hành"
                rules={[{required: true}]}
            >
                <InputNumber min={0} onChange={handlePracticePeriodOfStage2Change} />
            </Form.Item>
            {!!practiceTotalPeriod && <div className={"flex flex-col gap-2"}>
                <Form.Item
                    label="Lịch học gợi ý"
                    name={["model", "practiceSessions"]}
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        {getPeriodSessionOptions(theoryTotalPeriod ?? 0, 8)?.map((e, index) => (
                            <Radio
                                value={Array(e?.sessionsPerWeek).fill(e?.periodsPerSession)} key={index}>
                                {e.label}
                            </Radio>
                        ))}
                        <Radio value="practiceSessionscustom">
                            <Input
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Tự nhập VD: 3,2,2"
                                onChange={(e) => {
                                    form.setFieldsValue({
                                        model: {
                                            ...form.getFieldValue("model"),
                                            theorySessions: e.target.value?.split(",")?.map(Number),
                                        },
                                    });
                                }}
                            />
                        </Radio>
                    </Radio.Group>
                </Form.Item>
            </div>}
            <Form.Item name={["model", "sessionPriorityOfStage2"]} label="Ưu tiên buổi học" rules={[{required: true}]}>
                <Select
                    options={[
                        {value: 0, label: "Sáng"},
                        {value: 1, label: "Chiều"},
                        {value: -1, label: "Không ưu tiên"}
                    ]}
                />
            </Form.Item>
        </div>
        

        



        <Form.Item name={["model", "weekStart"]} label="Tuần bắt đầu học thực hành (nếu có)" rules={[{required: true}]}>
            <InputNumber min={0} />
        </Form.Item>
        
        
        
        <div className={"col-span-4"}>
            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>

            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>
            <Form.Item name={["model", "totalTheoryCourseClass"]} label="Số lớp học phần cần tạo" rules={[{required: true}]}>
                <InputNumber min={1} />
            </Form.Item>
        </div>
        <div className={"flex gap-5"}>
            <Form.Item

            >
                <Button type="primary" htmlType="submit"

                >
                    Tạo lớp học phần tự động
                </Button>
            </Form.Item>
            <div></div>
            <Form.Item>
                <Button type="primary" htmlType="submit" >
                    Tạo lớp học phần thủ công
                </Button>
            </Form.Item>
        </div>
    </Form>
}
export default Form_create_course_class_section_config;