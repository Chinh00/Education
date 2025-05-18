import { Badge } from "antd";
import {ReactElement} from "react";

const day_of_week: Record<number, ReactElement> = {
    0: <Badge>Thứ 2</Badge>,
    1: <Badge>Thứ 3</Badge>,
    2: <Badge>Thứ 4</Badge>,
    3: <Badge>Thứ 5</Badge>,
    4: <Badge>Thứ 6</Badge>,
    5: <Badge>Thứ 7</Badge>,
    6: <Badge>Chủ nhật</Badge>,
}
export type DayOfWeekProps = {
    day: number
}

const DayOfWeek = (props: DayOfWeekProps) => {
    return day_of_week[props.day]
}
export default DayOfWeek