import {Control, Controller} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {TextFieldProps} from "@mui/material/TextField";
export type FormInputTextProps = {
    name: string,
    control: Control<any, any>
} & TextFieldProps

export const FormInputText = ({ name, control, label, ...inputProps }: FormInputTextProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field: { onChange, value },
                         fieldState: { error },
                         // formState,
                     }) => (
                <TextField
                    {...inputProps}
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={(event) => onChange(event.target.value)}
                    value={value ?? ""}
                    fullWidth
                    label={label}
                    variant="outlined"
                />
            )}
        />
    );
};
export default FormInputText;
