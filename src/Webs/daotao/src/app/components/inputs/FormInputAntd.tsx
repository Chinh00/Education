import { Input } from "../ui/input"
import {Control, Controller} from "react-hook-form";
import {ComponentProps, HTMLInputTypeAttribute} from "react";
import { Form, FormItemProps } from "antd";

export type FormInputDateTimeProps = {
    control: Control<any, any>,
    name: string,
    type?: HTMLInputTypeAttribute,
} & ComponentProps<"input"> & FormItemProps

const FormInputAntd = (props: FormInputDateTimeProps) => {
    return <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
            <Form.Item {...props} initialValue={""}>
                <Input
                    {...props}
                    type={props?.type ?? "input"}
                    {...field}
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e)}
                    style={{
                        width: "100%"
                    }}
                />
            </Form.Item>
        )}
    />
}
export default FormInputAntd;