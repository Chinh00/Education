import { Button, Form, Input, Select } from "antd";

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
                          name,
                          ...tdProps
                      }: any) => {
    if (!editing) {
        return <td {...tdProps}>{children}</td>;
    }

    
    if (inputType === "select") {
        return (
            <td {...tdProps}>
                <Form.Item
                    name={name ?? dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng chọn ${title}!`,
                        },
                    ]}
                >
                    <Select style={{ maxWidth: 125, fontSize: 13 }} dropdownStyle={{ minWidth: 300 }}>
                        {semesterOptions.map((option: any) => (
                            <Select.Option key={option.value} value={option.value} className={"text-[13px]"}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </td>
        );
    }

    return (
        <td {...tdProps}>
            <Form.Item
                name={name ?? dataIndex}
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

export default EditableCell;