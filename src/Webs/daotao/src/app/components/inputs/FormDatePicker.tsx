import {DatePicker, DatePickerProps} from "@mui/x-date-pickers";
import {Control, Controller} from "react-hook-form";
import dayjs from "dayjs";

type DatePickerMuiProps = DatePickerProps & {
    control: Control<any, any>,
    name: string
}

const FormDatePicker = (props: DatePickerMuiProps) => {
    return <>
        <Controller render={({field, fieldState, formState}) => {
            return <DatePicker
                format="DD/MM/YYYY"
                {...props}
                value={dayjs(field.value)}
                inputRef={field.ref}
                onChange={(date) => field.onChange(date)}
            />
        }} name={props?.name} control={props?.control}/>
    </>
}

export default FormDatePicker