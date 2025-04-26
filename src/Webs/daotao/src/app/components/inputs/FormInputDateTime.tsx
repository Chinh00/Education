import { Input } from "../ui/input"
import {Control, Controller} from "react-hook-form";
import {ComponentProps, HTMLInputTypeAttribute} from "react";

export type FormInputDateTimeProps = {
    control: Control<any, any>,
    name: string,
    type: HTMLInputTypeAttribute
} & ComponentProps<"input">

const FormInputDateTime = (props: FormInputDateTimeProps) => {
    return <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
            <Input
                {...props}
                type={props.type}
                {...field}
                value={field.value || ""}
                onChange={e => field.onChange(e)}
            />
        )}
    />
}
export default FormInputDateTime;