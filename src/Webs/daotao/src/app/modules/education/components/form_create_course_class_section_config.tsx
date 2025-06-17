import {Button, Form, Input, InputNumber, Select, Radio, Checkbox} from "antd";
import type {FormInstance} from "antd/es/form/hooks/useForm";
import {useWatch} from "antd/es/form/Form";
import { getPeriodSessionOptions } from "../pages/periodSessionSuggestions";
import {Subject} from "@/domain/subject.ts";
import {useEffect} from "react";
import {useGetConditions} from "@/app/modules/common/hook.ts";
import {
    CreateSubjectScheduleConfigModel,
    SubjectScheduleConfigBothModel
} from "@/app/modules/education/services/courseClass.service.ts";
import UseCreateSubjectSchedule from "@/app/modules/education/hooks/useCreateSubjectScheduleConfig.ts";
import useCreateSubjectScheduleConfig from "@/app/modules/education/hooks/useCreateSubjectScheduleConfig.ts";
import toast from "react-hot-toast";
import {useGetSubjectScheduleConfig} from "@/app/modules/education/hooks/useGetSubjectScheduleConfig.ts";

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
    const {mutate, isPending} = useCreateSubjectScheduleConfig()
    
    const {data: subjectScheduleConfigs} = useGetSubjectScheduleConfig({
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
            }
        ]
    }, subject?.subjectCode !== undefined)
    
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
    
    if (stage === 0 || stage === 1) {
        return <Form<CreateSubjectScheduleConfigModel>
            form={form}
            layout="horizontal"
            initialValues={{
                semesterCode: semesterCode,
                model: {
                    subjectCode: subject?.subjectCode || "",
                    stage: stage,
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
                        {value: 0, label: "Sáng"},
                        {value: 1, label: "Chiều"},
                        {value: -1, label: "Không ưu tiên"}
                    ]}
                />
            </Form.Item>

            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>

            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Chọn điều kiện" />
            </Form.Item>
            
            <div className={"flex gap-5"}>
                <Form.Item

                >
                    <Button type="primary" htmlType="submit"

                    >
                        Lưu cấu hình
                    </Button>
                </Form.Item>
                <Form.Item

                >
                    
                </Form.Item>
                <div></div>
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
                lectureRequiredConditions: ["Lecture"],
                labRequiredConditions: [],
                totalPeriods: 0,
            }
        }}
        onFinish={(values) => {
            console.log(values)
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
            <Form.Item name={["model", "sessionPriorityOfStage1"]} label="Ưu tiên buổi học" >
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
            <Form.Item name={["model", "sessionPriorityOfStage2"]} label="Ưu tiên buổi học" >
                <Select
                    options={[
                        {value: 0, label: "Sáng"},
                        {value: 1, label: "Chiều"},
                        {value: -1, label: "Không ưu tiên"}
                    ]}
                />
            </Form.Item>
        </div>
        

        



        <Form.Item name={["model", "weekStart"]} label="Tuần bắt đầu học thực hành (nếu có)" >
            <InputNumber min={0} />
        </Form.Item>
        
        
        
        <div className={"col-span-4"}>
            <Form.Item name={["model", "lectureRequiredConditions"]} label="Điều kiện phòng lý thuyết">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>

            <Form.Item name={["model", "labRequiredConditions"]} label="Điều kiện phòng thực hành">
                <Select options={conditions?.data?.data?.items?.map(e => ({label: e?.conditionName, value: e?.conditionCode}))} mode="tags" placeholder="Nhập điều kiện, enter để thêm" />
            </Form.Item>
            
        </div>
        <div className={"flex gap-5"}>
            <Form.Item

            >
                <Button type="primary" htmlType="submit"

                >
                    Lưu cấu hình
                </Button>
            </Form.Item>
            <Form.Item

            >
            </Form.Item>
            <div></div>
            
        </div>
    </Form>
}
export default Form_create_course_class_section_config;