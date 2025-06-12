import { Form, Input, InputNumber } from "antd";

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          placeholder,
                          onChange,
                          ...restProps
                      }: any) => {
    const inputNode = inputType === 'number'
        ? <InputNumber
            placeholder={placeholder}
            
            size="small"
        />
        : <Input
            size="small"
            placeholder={placeholder}
            
        />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    id={dataIndex}
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