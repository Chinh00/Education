import { Form, Input, InputNumber } from "antd";
import { useAppDispatch, useAppSelector } from "@/app/stores/hook.ts";
import { setCourseClasses, SubjectStudySectionState } from "@/app/modules/education/stores/subject_study_section.ts";
import { CourseClass } from "@/domain/course_class.ts";
import { useState } from "react";

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          placeholder,
                          ...restProps
                      }: any) => {
    const dispatch = useAppDispatch();
    const {
        courseClasses,
    } = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);

    const [localValue, setLocalValue] = useState(
        inputType === "number" ? record?.numberStudentsExpected : record?.courseClassName
    );

    const handleSave = (value: any) => {
        dispatch(setCourseClasses({
            ...courseClasses,
            [record.id]: {
                ...courseClasses[record.id],
                ...(inputType === "number"
                    ? { numberStudentsExpected: +value } :
                    (inputType === "weeknumber") ? {weekStart: +value} : { courseClassName: `${value}`}),
            } as CourseClass,
        }));
    };

    const inputNode =
        inputType?.endsWith("number") ? (
            <InputNumber
                placeholder={placeholder}
                size="small"
                value={localValue}
                onChange={setLocalValue}
                onBlur={() => handleSave(localValue)}
                onPressEnter={() => handleSave(localValue)}
            />
        ) : (
            <Input
                size="small"
                placeholder={placeholder}
                value={localValue}
                onChange={e => setLocalValue(e.target.value)}
                onBlur={() => handleSave(localValue)}
                onPressEnter={() => handleSave(localValue)}
            />
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={`${inputType}_${dataIndex}`}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;