import { Badge } from "@/app/components/ui/badge";
import {Typography} from "@mui/material";

export type BadgeInformationProps = {
    text?: string;
    icon?: React.ReactNode;
    className?: string;
}

const BadgeInformation = (props: BadgeInformationProps) => {
    return (
        <Badge className={`bg-transparent mx-auto md:mx-0 border-gray-300 rounded-xl px-3 ${props?.className} flex justify-center content-center gap-2`}>
            <div>{props?.icon}</div>
            <Typography fontSize={"medium"} fontWeight={"bold"}  className={"flex gap-2 justify-center flex-row content-center text-gray-600"}>
                {props.text}
            </Typography>
        </Badge>
    )
}

export default BadgeInformation