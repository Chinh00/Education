import {DatePicker, DatePickerProps, DateTimePicker, DateTimePickerProps} from "@mui/x-date-pickers";
import {Control, Controller} from "react-hook-form";
import dayjs from "dayjs";

type FormDateTimePickerMuiProps = DateTimePickerProps & {
    control: Control<any, any>,
    name: string
}

const FormDateTimePicker = (props: FormDateTimePickerMuiProps) => {
    return <>
        <Controller render={({field, fieldState, formState}) => {
            return <DateTimePicker
                format="DD/MM/YYYY HH:mm"
                {...props}
                value={dayjs(field.value)}
                inputRef={field.ref}
                onChange={(date) => field.onChange(date)}
            />
        }} name={props?.name} control={props?.control}/>
    </>
}

export default FormDateTimePicker