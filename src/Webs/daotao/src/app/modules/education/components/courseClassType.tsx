import { Badge } from "antd";
import {ReactElement} from "react";

const courseClassType: Record<number, ReactElement> = {
    0: <Badge>Lý thuyết</Badge>,
    1: <Badge>Thực hành</Badge>
}
export type CourseClassTypeProps = {
    courseClassType: number
}

const CourseClassType = (props: CourseClassTypeProps) => {
    return courseClassType[props.courseClassType]
}
export default CourseClassType