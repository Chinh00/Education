import { Input } from "../ui/input"
import {Control, Controller} from "react-hook-form";
import {ComponentProps, HTMLInputTypeAttribute} from "react";
import { Form, FormItemProps } from "antd";
import * as React from "react";

export type FormInputDateTimeProps = {
    control: Control<any, any>,
    name: string,
    type?: HTMLInputTypeAttribute,
    placeholder?: string
} & FormItemProps

const FormInputAntd = (props: FormInputDateTimeProps) => {
    return <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
            <Form.Item {...props}>
                <Input
                    type={props?.type ?? "input"}
                    {...field}
                    placeholder={props?.placeholder ?? ""}
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