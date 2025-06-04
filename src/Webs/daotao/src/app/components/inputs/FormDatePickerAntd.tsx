import {DatePicker, Form, FormItemProps} from "antd";
import {
    Control,
    Controller,
} from "react-hook-form"
import vi from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';


export type FormDatePickerAntdProps = {
    control: Control<any, any>,
    name: string,
} & FormItemProps

export const viLocale: typeof vi = {
    ...vi,
    lang: {
        ...vi.lang,
        fieldDateFormat: 'DD/MM/YYYY',
        fieldDateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
        yearFormat: 'YYYY',
        cellYearFormat: 'YYYY',
    },
};
const FormDatePickerAntd = (props: FormDatePickerAntdProps) => {
    
    const defaultValue = dayjs('2024-01-01');
    return <Controller
       render={({ field, fieldState, formState, }) => {
           return <Form.Item {...props}>
               <DatePicker
                   showTime
                   locale={viLocale}
                   value={dayjs(field?.value)}
                   style={{
                       width: '100%',
                   }}
                   placement={"bottomLeft"}
                   onChange={e => field.onChange(e)}
               />
           </Form.Item>
       }}
       name={props?.name}
       control={props.control}
    />
}
export default FormDatePickerAntd;