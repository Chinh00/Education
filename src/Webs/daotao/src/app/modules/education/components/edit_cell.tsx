import {Button, Form, Input, Select} from "antd";

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          semesterOptions = [],
                          onShowSchedule,
                          ...restProps
                      }: any) => {
    if (!editing) {
        if (inputType === "button") {
            return (
                <td {...restProps}>
                    <Button size="small" onClick={() => onShowSchedule(record)}>
                        Xem lịch
                    </Button>
                </td>
            );
        }
        return <td {...restProps}>{children}</td>;
    }

    if (inputType === "select") {
        return (
            <td {...restProps}>
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng chọn ${title}!`,
                        },
                    ]}
                >
                    <Select style={{ maxWidth: 125 }}>
                        {semesterOptions.map((option: any) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </td>
        );
    }

    return (
        <td {...restProps}>
            <Form.Item
                name={dataIndex}
                style={{ margin: 0 }}
                rules={[
                    {
                        required: dataIndex === "courseClassName",
                        message: `Vui lòng nhập ${title}!`,
                    },
                ]}
            >
                <Input size="small" />
            </Form.Item>
        </td>
    );
};

export default EditableCell